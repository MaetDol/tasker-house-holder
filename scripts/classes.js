import { DATA_SEPARATOR, GLOBAL_SHEET_LINK } from './constant.js';
import Native from './native.js';
import { isFirstWriteOfToday, now } from './utils/date-utils.js';

export class Purchase {
	constructor(msg, parserCls) {
		this.parser = new parserCls(msg);
		this._isNot = false;
		if (this.parser.failed) {
			this._isNot = true;
		}
	}
	get data() {
		return this.parser.data;
	}
	get isNot() {
		return this._isNot;
	}
}

export class Data {
	static Props = /** @type {const} */ ({
		STORE: 'store',
		PRICE: 'price',
		TYPE: 'type',
		MEMO: 'memo',
	});

	constructor({ price = '', type = '', store = '', memo = '' }) {
		this.data = { price, type, store, memo };
	}

	raw() {
		return this.data;
	}
	get(name) {
		return this.data[name];
	}
	set(name, value) {
		this.data[name] = value;
	}

	toString() {
		return Object.values(this.data).join(DATA_SEPARATOR);
	}

	toSheetFormat() {
		const { price, type, memo } = this.data;
		let values = [['', '', Number(price), type, memo]];

		if (isFirstWriteOfToday()) {
			values[0][0] = now().date;
			values.unshift(['']);
		}
		return JSON.stringify({ values });
	}

	toNotifyFormat() {
		const { price, type, store } = this.data;
		return [price, type, store].join(DATA_SEPARATOR);
	}

	toLocal() {
		Object.entries(this.data).forEach(([k, v]) => Native.setLocal(k, v));
	}

	static fromNotifyFormat(str) {
		const [price, type, store, memo] = str.split(DATA_SEPARATOR);
		return new this({ price, type, store, memo });
	}
}

export class Parser {
	YEN = 11;
	USD = 1150;
	constructor(msg) {
		this._failed = false;
		this.exchangeRate = {
			원: (v) => this.toNumber(v),
			KRW: (v) => this.toNumber(v),
			엔: (v) => this.toNumber(v) * this.YEN,
			달러: (v) => this.toNumber(v) * this.USD,
		};
		this._parsedData = this.parse(msg);
	}
	parse() {
		throw 'Override';
	}
	toNumber(val) {
		return Number(val.replace(/,/g, ''));
	}
	get data() {
		return this._parsedData;
	}
	get failed() {
		return this._failed;
	}
}

export class ShinhanMsgParser extends Parser {
	/* ex)
[Web발신]
신한(0339)해외승인 이*민 10.00 달러       (US)07/19 02:13 GITHUB, IN 누적3,617,796원

// 또는..

[Web발신]
신한(0339)해외승인 이*민 KRW 37,681       (SE)07/27 10:02 AliExpress 누적4,308,807원
  */
	parse(msg) {
		const isPurchase = msg.match(/신한\(\d{4}\)(해외)?승인/);
		if (!isPurchase) {
			this._failed = true;
			return;
		}

		const EXCHANGE_REG =
			/((\w+)|[\d\.]+) ([\d\.,]+|([a-zA-Z가-힣]+))(?=\s{3,})/;
		const [, , prefix, price1, , suffix, price2] = msg.match(EXCHANGE_REG);

		const won = this.exchangeRate[suffix || prefix](
			(price1 || price2).replace(/,/g, ''),
		);

		const STORE_REG = /\s{3,}.+\d{2}:\d{2} (.+) 누적[\d,]+원/;
		const [, store] = msg.match(STORE_REG);

		return new Data({
			price: won,
			store: store,
		});
	}
}

export class ShinhanCheckParser extends Parser {
	/* ex)
[Web발신]
신한체크해외승인 이*민(2078) 06/13 22:56
6.45 달러 (FR)Patreon* Membership
  */

	parse(msg) {
		const isPurchase = msg.match(/신한체크(해외)?승인/);
		if (!isPurchase) {
			this._failed = true;
			return;
		}

		const TIME_REG = /\d\d\/\d\d\s?\d\d:\d\d\s?/;
		const raw = msg.split(TIME_REG)[1];
		const INFO_REG = /^([^\d\s]*)\s*([-,.\d]+)\s*(\S*)\s+(.+)/;
		const [_, prefix, price, suffix, store] = raw.match(INFO_REG);
		const won = this.exchangeRate[suffix || prefix](price);

		return new Data({
			price: won,
			store: store,
		});
	}
}

export class ShinhanSOLPay extends Parser {
	/*
[신한카드(0339)승인] 이*민
- 승인금액: 5,300원(일시불)
- 승인일시: 06/25 16:53
- 가맹점명: 네이버페이
- 누적금액: 2,351,951원

[신한카드 1544-7000]

  */
	parse(msg) {
		const isPurchase = /\[신한카드\(\d+\)승인\]/.test(msg);
		if (!isPurchase) {
			this._failed = true;
			return;
		}

		// - 승인일시: 06.25 13:30
		const TIME_REGEXP = /- 승인일시: (\d\d)\/(\d\d) \d\d:\d\d/;
		const STORE_REGEXP = /- 가맹점명: (.+)/;
		// 해외결제는 어떻게?
		const PRICE_REGEXP = /- 승인금액: ([\d,]+)/;

		const price = msg.match(PRICE_REGEXP)[1];
		const store = msg.match(STORE_REGEXP)[1];

		return new Data({
			price: this.exchangeRate['원'](price),
			store: store,
		});
	}
}

export class Spreadsheet {
	GET = 'GET';
	UPDATE = 'UPDATE';

	constructor(sheet, auth) {
		this.sheet = sheet;
		const a = auth.split(':');
		this.auth = { [a[0]]: a[1] };
		this.id = this.#id();
		this.baseUrl = this.#baseUrl();

		this.options = {
			GET: {
				queryString: 'majorDimension=ROWS',
				options: {
					headers: this.auth,
					method: 'GET',
				},
			},
			UPDATE: {
				queryString: 'valueInputOption=RAW',
				options: {
					headers: this.auth,
					method: 'PUT',
				},
			},
		};
	}

	#id() {
		const url = Native.global(GLOBAL_SHEET_LINK);
		return url.match(/\/d\/([\w-]+)\/?/)?.[1];
	}

	#baseUrl() {
		return `https://sheets.googleapis.com/v4/spreadsheets/${this.id}`;
	}

	#valuesUrl(sheet, range, queryString) {
		return `${this.baseUrl}/values/${sheet}!${range}?${queryString}`;
	}

	#request(url, options) {
		return fetch(url, options)
			.then((r) => r.json())
			.then((r) => {
				if (r.error) {
					throw r.error;
				}
				return r;
			});
	}

	#lastRowIndex() {
		const { queryString, options } = this.options[this.GET];
		const url = this.#valuesUrl(this.sheet, 'C:C', queryString);
		return this.#request(url, options).then((r) => r.values.length);
	}

	async append(data) {
		const lastRow = await this.#lastRowIndex();
		const { queryString, options } = this.options[this.UPDATE];
		const url = this.#valuesUrl(this.sheet, `A${lastRow + 1}`, queryString);

		return this.#request(url, { ...options, body: data });
	}
}
