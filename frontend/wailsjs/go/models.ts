export namespace app {
	
	export class AddPairToTemporaryInput {
	    word: string;
	    game_id: number;
	    base64_image: string;
	    image_format: string;
	
	    static createFrom(source: any = {}) {
	        return new AddPairToTemporaryInput(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.word = source["word"];
	        this.game_id = source["game_id"];
	        this.base64_image = source["base64_image"];
	        this.image_format = source["image_format"];
	    }
	}
	export class File {
	    type: string;
	    base64: string;
	
	    static createFrom(source: any = {}) {
	        return new File(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.base64 = source["base64"];
	    }
	}
	export class PairsWithBase64Image {
	    id: number;
	    word: string;
	    imageFormat: string;
	    base64Image: string;
	
	    static createFrom(source: any = {}) {
	        return new PairsWithBase64Image(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.word = source["word"];
	        this.imageFormat = source["imageFormat"];
	        this.base64Image = source["base64Image"];
	    }
	}
	export class GameInfo {
	    id: number;
	    title: string;
	    description: string;
	    pairs: PairsWithBase64Image[];
	
	    static createFrom(source: any = {}) {
	        return new GameInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.description = source["description"];
	        this.pairs = this.convertValues(source["pairs"], PairsWithBase64Image);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class PairWithBase64Image {
	    id: string;
	    word: string;
	    image_format: string;
	    base64_image: string;
	
	    static createFrom(source: any = {}) {
	        return new PairWithBase64Image(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.word = source["word"];
	        this.image_format = source["image_format"];
	        this.base64_image = source["base64_image"];
	    }
	}
	export class GetPlayGameInfoReponse {
	    game_title: string;
	    pairs: PairWithBase64Image[];
	
	    static createFrom(source: any = {}) {
	        return new GetPlayGameInfoReponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.game_title = source["game_title"];
	        this.pairs = this.convertValues(source["pairs"], PairWithBase64Image);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	

}

export namespace database {
	
	export class Pair {
	    id: number;
	    game_id: number;
	    word: string;
	    image_format: string;
	    bytes: number[];
	
	    static createFrom(source: any = {}) {
	        return new Pair(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.game_id = source["game_id"];
	        this.word = source["word"];
	        this.image_format = source["image_format"];
	        this.bytes = source["bytes"];
	    }
	}
	export class Game {
	    id: number;
	    title: string;
	    description: string;
	    categories: Category[];
	    pairs: Pair[];
	
	    static createFrom(source: any = {}) {
	        return new Game(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.description = source["description"];
	        this.categories = this.convertValues(source["categories"], Category);
	        this.pairs = this.convertValues(source["pairs"], Pair);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Category {
	    id: number;
	    title: string;
	    description: string;
	    games: Game[];
	
	    static createFrom(source: any = {}) {
	        return new Category(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.title = source["title"];
	        this.description = source["description"];
	        this.games = this.convertValues(source["games"], Game);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	

}

