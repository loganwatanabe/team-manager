

var should = require('should');

process.env.NODE_ENV = 'test';

var player_model = require('../app/models/player');
var mongoose = require('mongoose');
//var test_db = mongoose.connect('mongodb://localhost/test-test'); //connection to the testing environment DB

var  Player = mongoose.model('Player');

var app = require("../app");
var request = require("supertest");
var agent = request.agent(app);


//mocha stuff
after(function(done){
  // test_db.connection.db.dropDatabase(function(){
  //   test_db.connection.close(function(){
  //     done();
  //   });
  // });
		console.log("\nplayer testing finished");
		done();
});


//starting the testing

describe('Player', function(){	//context, so we can see where tests happen in console

	beforeEach(function(done){	//clears the database and creates testing objects
	    
	    Player.remove(done);//clear out db

	    testPlayer = {
	      first_name: 'Joe',
	      last_name: 'User',
	      date_of_birth: '6/25/1992'
	    };
    });

    after(function(done){
	    //clear out db
	    Player.remove(done);
    });



    //testing environment 

    describe('#save()', function(){
        var player_object;
        // you can use beforeEach in each nested describe
        beforeEach(function(done){
	        player_object = new Player(testPlayer);
	        player_object.save(done);	//if you need to link models, do it in this function callback
        });

        //finally, the tests
        it('test1: should have required properties', function(done){
        	var player_object = new Player(testPlayer)
          player_object.save(function(err, returned){
	          // dont do this: if (err) throw err; - use a test
	          should.not.exist(err);
	          returned.should.have.property('first_name', 'Joe');
	          returned.should.have.property('last_name', 'User');
	          var testDate = new Date('6/25/1992');
	          returned.should.have.property('date_of_birth', testDate);
	          done();
          });
        });
        // shouldn't work if the first_name is blank
        it('test2: should not allow a user to be created without a first name', function(done){
        	var no_first_name = new Player({'first_name': '', 'last_name': 'Smith', 'date_of_birth': '6/25/1992'});
        	no_first_name.save(function(err, returned){
        		// this should result in an error
        		should.exist(err);
        		done();
        	});
        });
        // shouldn't work if the last_name is blank
        it('test3: should not allow a user to be created without a last name', function(done){
        	var no_last_name = new Player({'first_name': 'John', 'last_name': '', 'date_of_birth': '6/25/1992'});
        	no_last_name.save(function(err, returned){
        		should.exist(err);
        		done();
        	});
        });
        // should allow a blank DOB
        it('test4: should allow a user to be created without a date of birth', function(done) {
        	var no_dob = new Player({'first_name': 'John', 'last_name': 'Smith', 'date_of_birth': ''});
        	no_dob.save(function(err, returned) {
        		should.not.exist(err);
        		done();
        	});
        });
    });

		// tests the name method
		describe('#full_name', function() {
			it('test5: should have a name method that gets the name in first last format', function(done) {
				var john_smith = new Player({'first_name': 'John', 'last_name': 'Smith', 'date_of_birth': '6/25/1992'});
				john_smith.save(function(err, returned) {
					should.not.exist(err);
					should(returned.full_name).equal('John Smith');
					done();
				});
			});
			// testing on another object to ensure full_name doesn't return John Smith every time lol
			it('test6: should have a name method that gets the name in first last format for every player model', function(done) {
				var ed_gruberman = new Player({'first_name': 'Ed', 'last_name': 'Gruberman', 'date_of_birth': '6/25/1992'});
				ed_gruberman.save(function(err, returned) {
					should.not.exist(err);
					should(returned.full_name).equal('Ed Gruberman');
					done();
				});
			});
		});

		//tests the official name method
		describe('#official_name', function() {
			it('test7: should have a name method that returns in last, first format', function(done) {
				var john_smith = new Player({'first_name': 'John', 'last_name': 'Smith', 'date_of_birth': '6/25/1992'});
				john_smith.save(function(err, returned) {
					should.not.exist(err);
					should(returned.official_name).equal('Smith, John');
					done();
				});
			});

			it('test7: should have a name method that returns in last, first format for every player model', function(done) {
				var ed_gruberman = new Player({'first_name': 'Ed', 'last_name': 'Gruberman', 'date_of_birth': '6/25/1992'});
				ed_gruberman.save(function(err, returned) {
					should.not.exist(err);
					should(returned.official_name).equal('Gruberman, Ed');
					done();
				});
			});
		});

		describe('#age', function() {
			it('test8: should have an age function', function(done) {
				var current_date = new Date();
				// birthday was one month ago, getMonth returns a month from 0-11
				var date_string = current_date.getMonth() + '/' + current_date.getDate() + '/' + (current_date.getFullYear() - 20);
				var age_passed = new Player({'first_name': 'Alex', 'last_name': 'Egan', 'date_of_birth': date_string});
				age_passed.save(function(err, returned) {
					should.not.exist(err);
					should(returned.age).equal(20);
					done();
				});
			});
			// birthday yesterday
			it('test9: should have an age function that returns the age, and works when the players bday was yesterday', function(done) {
				var current_date = new Date();
				var date_string = (current_date.getMonth() + 1) + '/' + (current_date.getDate() - 1) + '/' + (current_date.getFullYear() - 20);
				var bday_yesterday = new Player({'first_name': 'Alex', 'last_name': 'Egan', 'date_of_birth': date_string});
				bday_yesterday.save(function(err, returned) {
					should.not.exist(err);
					should(returned.age).equal(20);
					done();
				});
			});
			// birthday tomorrow
			it('test10: should have an age function that returns the age, and works if the players bday is tomorrow', function(done) {
				var current_date = new Date();
				var date_string = (current_date.getMonth() + 1) + '/' + (current_date.getDate() + 1) + '/' + (current_date.getFullYear() - 20);
				var bday_tomorrow = new Player({'first_name': 'Alex', 'last_name': 'Egan', 'date_of_birth': date_string});
				bday_tomorrow.save(function(err, returned) {
					should.not.exist(err);
					should(returned.age).equal(19);
					done();
				});
			});
			// birthday next month
			it('test11: should have an age function that returns the currect age if the players bday is next month', function(done) {
				var current_date = new Date();
				var date_string = (current_date.getMonth() + 2) + '/' + (current_date.getDate()) + '/' + (current_date.getFullYear() - 20);
				var bday_later = new Player({'first_name': 'Alex', 'last_name': 'Egan', 'date_of_birth': date_string});
				bday_later.save(function(err, returned) {
					should.not.exist(err);
					should(returned.age).equal(19);
					done();
				});
			});
		});

		// routing and controller testing
		// just testing that it gets the expected response, not testing if the routes behave properly
		// will look into that and do that later
		describe('routes', function() {
			var route_player;
			beforeEach(function(done) {
				route_player = new Player(testPlayer);
				route_player.save(done);
			});

			// testing index
			it('can access /players', function(done) {
				agent.get('/players').expect(200).end(function(err, res) {
					// could we just return done(err) without the if? IDK this is safe though i think
					if(err) {
						return done(err);
					}
					done();
				});
			});
			//testing show
			it('can access /players/:id for route_player', function(done) {
				var path = "/players/" + route_player._id;
				agent.get(path).expect(200).end(function(err, res) {
					if(err) {
						return done(err);
					}
					done();
				});
			});
			// show with a bad ID shouldn't work
			it('can not access /players/:id with an invalid ID', function(done) {
				agent.get('/players/badpath').expect(404).end(function(err, res) {
					if(err) {
						return done(err);
					}
					done();
				});
			});
			// should have a new page
			it('can go to /players/new to render a new page', function(done) {
				agent.get('/players/new').expect(200).end(function(err, res) {
					if(err) {
						return done(err);
					}
					return done();
				});
			});
			// should have an edit page
			it('can go to /players/:id/edit to render an edit page', function(done) {
				var path = '/players/' + route_player._id + '/edit';
				agent.get(path).expect(200).end(function(err, res) {
					if(err) {
						return done(err);
					}
					return done();
				});
			});
			// should not go to an edit page if the id is invalid
			it('can not go to an edit page if the id param is invalid', function(done) {
				var path = '/players/badpath/edit';
				agent.get(path).expect(404).end(function(err, res) {
					if(err) {
						return done(err);
					}
					return done();
				});
			});
			// can create a new player
			it('can create a new player', function(done) {
				agent.post('/players/new').field('first_name', 'Alex').field('last_name', 'Egan').field('month', 6).field('day', 25).field('year', 1992).expect(302).end(function(err, res) {
					if(err) {
						return done(err);
					}
					// test for location
					return done();
				});
			});
			// can update a player
			it('can update a player', function(done) {
				var path = '/players/' + route_player._id + '/update';
				agent.post(path).field('first_name', 'Alex').field('last_name', 'Egan').field('month', 6).field('day', 25).field('year', 1992).expect(302).end(function(err, res) {
					if(err) {
						return done(err);
					}
					// test for location
					// test for update
					return done();
				});
			});
			it('can delete a player', function(done) {
				var path = '/players/' + route_player._id + '/delete';
				agent.post(path).expect(302).end(function(err, res) {
					if(err) {
						return done(err);
					}
					// test that it was properly removed
					return done();
				});
			});
		});

});