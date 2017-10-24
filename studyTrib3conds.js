// ############################## Helper functions ##############################

// Shows slides. We're using jQuery here - the **$** is the jQuery selector function, which takes as input either a DOM element or a CSS selector string.
function showSlide(id) {
  // Hide all slides
  $(".slide").hide();
  // Show just the slide we want to show
  $("#"+id).show();
}

// Get random integers.
// When called with no arguments, it returns either 0 or 1. When called with one argument, *a*, it returns a number in {*0, 1, ..., a-1*}. When called with two arguments, *a* and *b*, returns a random value in {*a*, *a + 1*, ... , *b*}.
function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}


// Add a random selection function to all arrays (e.g., <code>[4,8,7].random()</code> could return 4, 8, or 7). This is useful for condition randomization.
Array.prototype.random = function() {
  return this[random(this.length)];
}

// shuffle function - from stackoverflow?
// shuffle ordering of argument array -- are we missing a parenthesis?
function shuffle (a)
{
    var o = [];

    for (var i=0; i < a.length; i++) {
      o[i] = a[i];
    }

    for (var j, x, i = o.length;
         i;
         j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

// from: http://www.sitepoint.com/url-parameters-jquery/
$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (results==null){
    return null;
  } else{
    return results[1] || 0;
  }
}

 // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
 //from https://github.com/jashkenas/underscore/blob/3699e39631cfaa99ca88dc279decb6ff57989413/underscore.js#L691 and https://github.com/jashkenas/underscore/blob/3699e39631cfaa99ca88dc279decb6ff57989413/underscore.js#L691
  myRange = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };
// ############################## Configuration settings ##############################

var stim_set = [];
var nouns_big = ['baby', 'balloon', 'cake', 'duckling', 'elephant', 'gnome', 'hippo', 'house', 'monkey', 'bunny', 'plane', 'umbrella'];
var nouns_small = ['ant', 'bean', 'candy', 'hazelnut', 'earring', 'fly', 'blueberry', 'seed', 'ladybug', 'pill', 'pin', 'tack'];
//condition 1 - relpics, condition 2 mixed order, condition 3 mixed order small items

//weights the conditions so that 20% (~ n=50) get condition 1, 40% (~n=100) get condition 2 and 40% (~n=100) get condition 3
//from Stackoverflow https://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
function weightedRand2(spec) {
  var i, sum=0, r=Math.random();
  for (i in spec) {
    sum += spec[i];
    if (r <= sum) return i;
  }
}

var condition = weightedRand2({1:0.2, 2:0.8, 3:0}); // random in distribution...
//for testing purposes of given condition
//var condition = 1;
//for testing purposes - short varient
//var nouns = ['baby', 'balloon'];
var dirs = ['asc', 'desc'];
var adjs = ['big', 'small'];
var verb = ['are'];
var NUM_PICS = 7;
var TEST_WORD = "test";

//In condition 1 where the pictures are in order, gets the order. In conditions 2 and 3 shuffles integers 1-NUM_PICS in a random order. will be called for each stimulus throughout
function getNumOrder(condition, dir){
	var num_order = [];
	if (condition == 1){
		if (dir == 'asc'){
			num_order = myRange(1,NUM_PICS+1);
		} else {
			num_order = myRange(1,NUM_PICS+1).reverse();
		}
		 
	} else {
		num_order = shuffle(myRange(1,NUM_PICS+1));
	}
	return num_order;
}

var trial_verb = shuffle(verb).shift();
var nouns = [];
if (condition == 3){
	nouns = nouns_small;
} else {
	nouns = nouns_big;
}
if (condition == 1){
	for (var i = 0; i < nouns.length; i++){
		for (var j = 0; j < dirs.length; j++){
			for (var k = 0; k < adjs.length; k++){
				var stim_element = {noun: nouns[i], dir: dirs[j], adj: adjs[k], order: getNumOrder(condition, dirs[j]), vb: trial_verb};
				stim_set.push(stim_element);
			}
		} 
	}
} else {
	for (var i = 0; i < nouns.length; i++){
		for (var k = 0; k < adjs.length; k++){
			var stim_element = {noun: nouns[i], adj: adjs[k], dir: 'na', order: getNumOrder(condition, 'na'), vb: trial_verb};
			stim_set.push(stim_element);
		}
	} 

}


//gets the right set of image files for the trial


function getImageFiles(elem) {
	var pic_set = [];	
	for (var j = 1; j <= NUM_PICS; j++) {
		pic_set.push('final-images/' + elem.noun + '_' + elem.order[j-1] + '.png');
			}
	

  return pic_set;
}
stim_set = shuffle(stim_set);
//Makes sure that you don't get two of the same object in a row
function AreAdjacentNouns(stims) {
	var are_adj = false;
	var i = 0;
	while (are_adj == false && i < (stims.length-1) ) {
		if (stims[i].noun == stims[i+1].noun){
			are_adj = true;			
		} 
		i++;
	}
	return are_adj;
}
while (AreAdjacentNouns(stim_set) == true) {
	stim_set = shuffle(stim_set);
}
//adds the pretest items to the beginning of the stimulus array
stim_set.unshift({noun:"flower", order: getNumOrder(), adj: "pretty", dir: 'na', vb: trial_verb}, {noun:"car", order: getNumOrder(), adj:"ugly", dir: 'na', vb: trial_verb});

var totalTrials = stim_set.length;
//gets the right audio file for the trial
function getAudioFile(elem) {
	var audio_name = 'audio/mp3s/' + elem.noun + '_' + elem.adj + '_' + elem.vb + '.mp3';
	return audio_name;
}
//gives legth of time from adjective onset to end of audio for each adjective and verb type combination
function getAudioTailLength(elem){
	switch (elem.vb) {
    case "find":
		switch (elem.adj){
			case "small":
				var audio_tail = 0.947;
				break;
			case "big":
				var audio_tail = 0.732;
				break;
			case "pretty":
				var audio_tail = 0.890;
				break;
			case "ugly":
				var audio_tail = 0.879;
				break;
		}
	case "seem":
		switch (elem.adj){
			case "small":
				var audio_tail = 1.259;
				break;
			case "big":
				var audio_tail = 1.108;
				break;
			case "pretty":
				var audio_tail = 1.150;
				break;
			case "ugly":
				var audio_tail = 1.286;
				break;
		}
	case "are":
		switch (elem.adj){
			case "small":
				var audio_tail = 0.956;
				break;
			case "big":
				var audio_tail = 0.715;
				break;
			case "pretty":
				var audio_tail = 0.882;
				break;
			case "ugly":
				var audio_tail = 0.875;
				break;
		}
	}
       
    
	return audio_tail;
}
//gets the prototype status of the noun
function getProtStatus(elem){
	switch(elem.noun){
		case "flower":
			var stat = "na";
			break;
		case "car":
			var stat = "na";
			break;
		case 'baby':
			var stat = "small";
			break;
		case 'balloon':
			var stat = "neither";
			break;
		case 'cake':
			var stat = "neither";
			break;
		case 'duckling':
			var stat = "small";
			break;
		case 'elephant':
			var stat = "big";
			break;
		case 'gnome':
			var stat = "small";
			break;
		case 'hippo':
			var stat = "big";
			break;
		case 'house':
			var stat = "big";
			break;
		case 'monkey':
			var stat = "neither";
			break;
		case 'bunny':
			var stat = "small"
			break;
		case 'plane':
			var stat = "big";
			break;
		case 'umbrella':
			var stat = "neither";
			break;
		default:
			var stat = "other";
	}
	return stat;
}

// sort function for numbers 
function compareNumbers(a, b) {
  return a - b;
}

// converts the check box numbers check to the file name numbers corresponding to the sizes of the pictures.
function convertRatingstoSizes(rats, blah) {
	var sizes_checked = [];
	if (checkNone(rats) == false && checkAll(rats) == false) {
		for (var i = 0; i < rats.length; i++) {
			sizes_checked.push(blah.order[rats[i]-1]);
			}
	} else if (checkNone(rats) == true && rats.length > 1){
		for (var i = 0; i < rats.length-1; i++) {
			sizes_checked.push(blah.order[rats[i]-1]);
			}
		sizes_checked.push(9);
	} else if (checkNone(rats) == true) {
		sizes_checked.push(9);
	} else if (checkAll(rats) == true) {
		sizes_checked.push([1, 2, 3, 4, 5, 6, 7]);
	}
	var sizes_sort = sizes_checked.sort(compareNumbers);
	return sizes_sort;
}

// checks that images selected are consecutive
function checkConsecutive(rats) {
	is_nonconsec = false;
	var i = 0;
	var rats_nums = rats.map(Number);
	var rats_sort = rats_nums.sort(compareNumbers);
	while (is_nonconsec == false && i < (rats_sort.length-1) ) {
		if (rats_sort[i] != (rats_sort[i+1]-1)){
			is_nonconsec = true;			
		}
		i++;
	}
	return is_nonconsec;
}
// checks to make sure either first or last item is selected
function checkEndpoint(rats) {
	var is_endpoint = rats.includes(1)||rats.includes(7)||rats.includes(9)||rats.includes(11);
	return is_endpoint;
}
//gets endpoint
function getEndpoint(rats) {
	if (rats.includes(1)){
		var ep = 1;
	} else if (rats.includes(7)){
		var ep = 7;
	} else if (rats.includes(9)){
		var ep = 9;
	} else if (rats.includes(11)){
		var ep = 11;
	} else {
		var ep = "na";
	}
	return ep;
}
//looks to see whether they selected "none of them"
function checkNone(rats) {
	if (rats.includes("9")){
		var noneofthem = true;
	} else {
		var noneofthem = false;
	}
	return noneofthem;
}

//looks to see whether they selected "all of them"
function checkAll(rats) {
	if (rats.includes("11")){
		var allofthem = true;
	} else {
		var allofthem = false;
	}
	return allofthem;
}

// check whether endpoint is correct
function checkEndpointCorrect(rats, blah){
	var good_endp = false;
	if (rats.includes(9)) {
		good_endp = true;
	} else if (rats.includes(11)){
		good_endp = true;
	} else if (blah.adj == "big"){
				if (rats.includes(7)) {
				good_endp = true;
			} 			
		} else  {
			if (rats.includes(1)) {
				good_endp = true;
			}
		}
	return good_endp;
}

//get the number of checked boxes, adjusting for none and all
function getNumChecked(rats){
	if (rats.includes("9")){
		numberChecked = 0;
	} else if (rats.includes("11")){
		numberChecked = 7;
	} else {
		numberChecked = rats.length;
	}
	return numberChecked;
}

// Audio check
var playBtn = document.getElementById('play');
var stopBtn = document.getElementById('stop');

var playSound = function() {
	audio.play();
};

playBtn.addEventListener('click', playSound, false);
stopBtn.addEventListener('click', function(){audio.pause()}, false);
 


// Show the instructions slide -- this is what we want subjects to see first.
showSlide("instructions");


var elem;
 
// ############################## The main event ##############################
var experiment = {

    // The object to be submitted.
    data: {

      expt_condition: [],
	  noun: [],
      ratings: [],
	  sizes: [],
	  non_consecutive: [],
	  is_endpoint: [],
      elapsed_ms: [],
	  elapsed_first_click_ms: [],
	  pic_order: [],
	  adj: [],
	  verb: [],
	  dir: [],
	  prototype_status: [],
	  num_checked: [],
      num_errors: [],
	  endpoint: [],
	  good_ep: [],
	  none_checked: [],
	  all_checked: [],
      user_agent: [],
      window_width: [],
      window_height: [],
	  dpi_width: [],
	  dpi_height: [],
	  age: [],
	  gender: [],
	  education: [],
	  race: [],
	  screen_size: [],
	  lang: [],
      expt_aim: [],
      expt_gen: [],
    },

    start_ms: 0,  // time current trial started ms
    num_errors: 0,    // number of errors so far in current trial
	first_click: true,

   //checks that the audio is functioning
	precheck: function(){
		var aut = $("#audtest").val();
		if (aut.toLowerCase() != TEST_WORD) {
			$("#audMessage").html("please enter the text you heard");
		} else {
			showSlide('instructions2');
		}
	},
	 // end the experiment
    end: function() {
      showSlide("finished");
      setTimeout(function() {
        turk.submit(experiment.data)
      }, 3000);
    },
	//gets the reaction time from adjective onsect to first click
	log_checkbox: function() {
		if (!experiment.first_click)
			return;
		experiment.first_click = false;
		var response_time = Date.now() - experiment.start_ms;
		experiment.data.elapsed_first_click_ms.push(response_time);
	},
    // LOG RESPONSE
    log_response: function() {
      var response_logged = false;
      var elapsed = Date.now() - experiment.start_ms;

      //Array of check boxes
      var responses = [];
	  $(".judgment_box").each(function(){
		if($(this).is(':checked')){
			responses.push($(this).attr("value"));
		}
	  });
	  var size_results = convertRatingstoSizes(responses, elem)
	  if (responses.length > 0) {
		response_logged = true;
		experiment.data.elapsed_ms.push(elapsed);
		experiment.data.ratings.push(responses);		
		experiment.data.num_checked.push(getNumChecked(responses));
		experiment.data.sizes.push(size_results);
		experiment.data.is_endpoint.push(checkEndpoint(size_results));
		experiment.data.non_consecutive.push(checkConsecutive(size_results));
		experiment.data.endpoint.push(getEndpoint(size_results));
		experiment.data.good_ep.push(checkEndpointCorrect(size_results, elem));
		experiment.data.none_checked.push(checkNone(responses));
		experiment.data.all_checked.push(checkAll(responses));
	  }

      if (response_logged) {
        nextButton.blur();

        // uncheck check boxes
        $(".judgment_box").attr("checked", false);

        $('#stage-content').hide();
        experiment.next();
      } else {
          experiment.num_errors += 1;
          $("#testMessage").html('<font color="red">' +
               'Please make a response!' +
               '</font>');
      }
    },

    // The work horse of the sequence - what to do on every trial.
    next: function() {
      // Allow experiment to start if it's a turk worker OR if it's a test run
      if (window.self == window.top | turk.workerId.length > 0) {
          $("#testMessage").html('');   // clear the test message
          $("#prog").attr("style","width:" +
              String(100 * (1 - stim_set.length/totalTrials)) + "%")
          // style="width:progressTotal%"
          window.setTimeout(function() {
            $('#stage-content').show();            
            experiment.num_errors = 0;
			experiment.first_click = true;
          }, 150);

          // Get the current trial - <code>shift()</code> removes the first element
          // select from our scales array and stop exp after we've exhausted all the domains
          elem = stim_set.shift();

          //If the current trial is undefined, call the end function.
          if (typeof elem == "undefined") {
            return experiment.debriefing();
          }

          // Display the sentence stimuli
          var image_filenames = getImageFiles(elem);
		  for (i = 1; i<= NUM_PICS; i++){
			  var file_name = image_filenames.shift();
			  $("#noun_" + i).attr('src', file_name);
		  }
		
		$("#nextButton").prop("disabled", true);
		var audio = new Audio();
		audio.loop = false;
		audio.addEventListener("canplaythrough", function() {audio.play();});

		//to load a file; soundFileSource is the filename of the sound file you want to play
		audio.setAttribute("src", getAudioFile(elem));
		audio.load();
		doSomethingAfterAudio(elem);

		//do something when audio ended - this checks in every 50ms once triggered and performs an action when the audio has finished playing, and enables the next button
		function doSomethingAfterAudio(elem){
			if (audio.currentTime > audio.duration - getAudioTailLength(elem)) {
				experiment.start_ms = Date.now();
				$("#nextButton").removeAttr('disabled');
			} else {
				setTimeout(function() {doSomethingAfterAudio(elem);}, 50);
			};			
			 
		};
		dpi_w = document.getElementById('testdiv').offsetWidth;
		dpi_h = document.getElementById('testdiv').offsetHeight;
        experiment.data.noun.push(elem.noun);
		experiment.data.pic_order.push(elem.order);
		experiment.data.adj.push(elem.adj);
		experiment.data.verb.push(elem.vb);
		experiment.data.dir.push(elem.dir);
		experiment.data.expt_condition.push(condition);
		experiment.data.prototype_status.push(getProtStatus(elem));  
        experiment.data.window_width.push($(window).width());
        experiment.data.window_height.push($(window).height());
		experiment.data.dpi_width.push(dpi_w);
        experiment.data.dpi_height.push(dpi_h);
		

        showSlide("stage");
      }
    },

    //  go to debriefing slide
    debriefing: function() {
      showSlide("debriefing");
    },

    // submitcomments function
    submit_comments: function() {
		var races = document.getElementsByName("race[]");
      for (i = 0; i < races.length; i++) {
        if (races[i].checked) {
          experiment.data.race.push(races[i].value);
        }
      }
      experiment.data.age.push(document.getElementById("age").value);
      experiment.data.gender.push(document.getElementById("gender").value);
      experiment.data.education.push(document.getElementById("education").value);
	  experiment.data.screen_size.push(document.getElementById("screen").value);
	  experiment.data.lang.push(document.getElementById("homelang").value);
      experiment.data.expt_aim.push(document.getElementById("expthoughts").value);
      experiment.data.expt_gen.push(document.getElementById("expcomments").value);
      experiment.data.user_agent.push(window.navigator.userAgent);
      experiment.end();
    }
}
//demographics form validation + experiment end
$(function() {
  $('form#demographics').validate({
	 rules: {
	  "age": "required",
      "gender": "required",
      "education": "required",
      "race[]": "required",
      "lg": "required",
	  "screen": "required",
    },
    messages: {
	  "age": "Please choose an option",
      "gender": "Please choose an option",
      "education": "Please choose an option",
	  "screen": "Please choose an option",
      "lg": "Please provide your native language",
    },
    submitHandler: experiment.submit_comments
  });
  $('#race_group input[value=no_answer]').click(function() {
    $('#race_group input').not('input[value=no_answer]').attr('checked', false);
  });
  $('#race_group input').not('input[value=no_answer]').click(function() {
    $('#race_group input[value=no_answer]').attr('checked', false);
  });
  /* experiment.next();
  experiment.next(); */
  
  $(".judgment_box").change(function(){experiment.log_checkbox();});
});

 

