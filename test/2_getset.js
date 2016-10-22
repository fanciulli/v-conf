var expect = require("chai").expect;
var fs=require('fs-extra');

var loadObj={
  load: {
    a: {
      type: "number",
      value: 100
    },
    b: {
      type: "string",
      value: "A String"
    },
    c: {
      type: "boolean",
      value: false
    }
  }
};

/**
 * FIND PROP
 */
describe("#findProp()", function() {
    beforeEach(function() {
    	fs.writeJsonSync("/tmp/findProp.json",loadObj);
        var fileExists=fs.existsSync("/tmp/findProp.json");
        expect(fileExists).to.equal( true );
    });
	
    it("findProp returns the correct object", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/findProp.json');
        var b=vconf.findProp('load.b');

        expect(b).to.deep.equal({
            type: "string",
            value: "A String"
        });
    });

    it("findProp returns the whole dataset", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/findProp.json');
        var b=vconf.findProp();

        expect(b).to.deep.equal(loadObj);
    });

    it("findProp returns null if key is not in configuration", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/findProp.json');
        var b=vconf.findProp('load.d');

        expect(b).to.equal(null);
    });

});


/**
 * HAS
 */
describe("#has()", function() {
    beforeEach(function() {
    	fs.writeJsonSync("/tmp/has.json",loadObj);
        var fileExists=fs.existsSync("/tmp/has.json");
        expect(fileExists).to.equal( true );
    });

    it("Method correctly returns if key is present", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/has.json');
        var a=vconf.has('load.a');
        var d=vconf.has('load.d');

        expect(a).to.equal(true);
        expect(d).to.equal(false);
    });


});

/**
 * GET
 */
describe("#get()", function() {
    beforeEach(function() {
    	fs.writeJsonSync("/tmp/get.json",loadObj);
        var fileExists=fs.existsSync("/tmp/get.json");
        expect(fileExists).to.equal( true );
    });

    it("Key found", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/get.json');
        var a=vconf.get('load.a');

        expect(a).to.equal( 100 );
    });

    it("Key found (default provided)", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/get.json');
        var a=vconf.get('load.a',0);

        expect(a).to.deep.equal( 100 );
    });

    it("Key not found", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/get.json');
        var a=vconf.get('load.d');

        expect(a).to.deep.equal( undefined );
    });

    it("Key not found (default provided)", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/get.json');
        var a=vconf.get('load.d',100);

        expect(a).to.deep.equal( 100 );
    });

});

/**
 * SET
 */
describe("#set()", function() {
    beforeEach(function() {
    	fs.writeJsonSync("/tmp/set.json",loadObj);
        var fileExists=fs.existsSync("/tmp/set.json");
        expect(fileExists).to.equal( true );
    });

    it("Setting values", function(){
        var vconf=new (require(__dirname+'/../index.js'))();
	vconf.loadFile('/tmp/set.json');

	var a=vconf.get('load.a');
        var b=vconf.get('load.b');
        var c=vconf.get('load.c');

	expect(a).to.equal( 100 );

        expect(b).to.equal( "A String" );

        expect(c).to.equal( false );

        vconf.set('load.a',50);
        vconf.set('load.b',"Updated string");
        vconf.set('load.c',true);

        expect(vconf.data.load.a).to.deep.equal( {
            type: "number",
            value: 50
        } );

        expect(vconf.data.load.b).to.deep.equal( {
            type: "string",
            value: "Updated string"
        } );

        expect(vconf.data.load.c).to.deep.equal( {
            type: "boolean",
            value: true
        } );
    });

    it("Adding keys", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

	    var d=vconf.get('load.d');
        var e=vconf.set('load.e');
        var f=vconf.set('load.f');
	    expect(d).to.equal( undefined );

        expect(e).to.equal( undefined );

        expect(f).to.equal( undefined );


        vconf.set('load.d',100);
        vconf.set('load.e',"A value");
        vconf.set('load.f',true);

        expect(vconf.data.load.d).to.deep.equal( {
            type: "number",
            value: 100
        } );

        expect(vconf.data.load.e).to.deep.equal( {
            type: "string",
            value: "A value"
        } );

        expect(vconf.data.load.f).to.deep.equal( {
            type: "boolean",
            value: true
        } );
    });
    

});


/**
 * ADD CONFIG VALUE
 */
describe("#addConfigValue()", function() {
    beforeEach(function() {
    	fs.writeJsonSync("/tmp/addConfigValue.json",loadObj);
        var fileExists=fs.existsSync("/tmp/addConfigValue.json");
        expect(fileExists).to.equal( true );
    });

    it("Adding a new key (keys not in configuration)", function(){
        var vconf=new (require(__dirname+'/../index.js'))();
        vconf.loadFile('/tmp/addConfigValue.json');

        vconf.addConfigValue('load.d','string', "Another string" );
        vconf.addConfigValue('load.e','number', 500 );
        vconf.addConfigValue('load.f','boolean', true );

        expect(vconf.data.load.a).to.deep.equal( {
            type: "number",
            value: 100
        } );

        expect(vconf.data.load.b).to.deep.equal( {
            type: "string",
            value: "A String"
        } );

        expect(vconf.data.load.c).to.deep.equal( {
            type: "boolean",
            value: false
        } );

	 expect(vconf.data.load.d).to.deep.equal( {
            type: "string",
            value: "Another string"
        } );

        expect(vconf.data.load.e).to.deep.equal( {
            type: "number",
            value: 500
        } );

        expect(vconf.data.load.f).to.deep.equal( {
            type: "boolean",
            value: true
        } );
    });

    it("Adding a new key (keys in configuration)", function(){
        var vconf=new (require(__dirname+'/../index.js'))();
        vconf.loadFile('/tmp/addConfigValue.json');


        expect(vconf.data.load.a).to.deep.equal( {
            type: "number",
            value: 100
        } );

        expect(vconf.data.load.b).to.deep.equal( {
            type: "string",
            value: "A String"
        } );

        expect(vconf.data.load.c).to.deep.equal( {
            type: "boolean",
            value: false
        } );

        vconf.addConfigValue('load.a','number', 500 );
        vconf.addConfigValue('load.b','string', "Another string" );
        vconf.addConfigValue('load.c','boolean', true );

        expect(vconf.data.load.a).to.deep.equal( {
            type: "number",
            value: 500
        } );

        expect(vconf.data.load.b).to.deep.equal( {
            type: "string",
            value: "Another string"
        } );

        expect(vconf.data.load.c).to.deep.equal( {
            type: "boolean",
            value: true
        } );

    });

   

});

/**
 * GET KEYS
 */
describe("#getKeys()", function() {
    beforeEach(function() {
    	fs.writeJsonSync("/tmp/getKeys.json",loadObj);
        var fileExists=fs.existsSync("/tmp/getKeys.json");
        expect(fileExists).to.equal( true );
    });

    it("No key", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/getKeys.json');
        var keys=vconf.getKeys();

        expect(keys).to.deep.equal( ['load'] );
    });

    it("With key", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/getKeys.json');
        var keys=vconf.getKeys('load');

        expect(keys).to.deep.equal( ['a','b','c'] );
    });

    

});
