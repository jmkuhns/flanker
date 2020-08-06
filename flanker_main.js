<!-- CHANGE 1: Using the GitHub-hosted files -->

<script src="https://jmkuhns.github.io/flanker/js/jspsych.js"></script>
<script src="https://jmkuhns.github.io/flanker/jspsych-html-keyboard-response.js"></script>
<script src="https://jmkuhns.github.io/flanker/js/jsPsych/jquery-3.5.1.min.js"></script>
<link href="https://jmkuhns.github.io/flanker/jspsych.css" rel="stylesheet" type="text/css" />
<!-- CHANGE 2: Loading the main experiment script in the same folder-->

<script src="https://jmkuhns.github.io/flanker/flanker_main.js"></script>

/*set up welcome block*/
var welcome = {
  type: "html-keyboard-response",
  stimulus: "Welcome to the experiment. Press any key to begin."
};
/* var timeline = [];
/* timeline.push(welcome);
/*set up instructions block*/

var instructions = {
  type: "html-keyboard-response",
  stimulus: "<p>In this task, you will see five arrows on the screen, like the example below.</p>" +
    "<p> <<<<< </p>" +
    "<p>Press the left arrow key if the middle arrow is pointing left. (<)</p>" +
    "<p>Press the right arrow key if the middle arrow is pointing right. (>)</p>" +
    "<p>Press any key to begin.</p>",
  post_trial_gap: 1000
};


/*defining stimuli*/
var test_stimuli = [
  {
    stimulus: "<<<<<",
    data: { stim_type: 'congruent', direction: 'left'}
  },
  {
    stimulus: ">>>>>",
    data: { stim_type: 'congruent', direction: 'right'}
  },
  {
    stimulus: "<<><<",
    data: { stim_type: 'incongruent', direction: 'right'}
  },
  {
    stimulus: ">><>>",
    data: { stim_type: 'incongruent', direction: 'left'}
  }
];



 /* experiment parameters */
        var reps_per_trial_type = 4;


/* defining test timeline */
var test = {
  timeline: [{
    type: 'html-keyboard-response',
    choices: [37, 39],
    trial_duration: 1500,
    stimulus: jsPsych.timelineVariable('stimulus'),
    data: jsPsych.timelineVariable('data'),
    on_finish: function (data) {
      var correct = false;
      if (data.direction == 'left' && data.key_press == 37 && data.rt > -1) {
        correct = true;
      } else if (data.direction == 'right' && data.key_press == 39 && data.rt > -1) {
        correct = true;
      }
      data.correct = correct;
    },
    post_trial_gap: function () {
      return Math.floor(Math.random() * 1500) + 500;
    }
  }],
  timeline_variables: test_stimuli,
  sample: {
    type: 'fixed-repetitions',
    size: reps_per_trial_type
  }
};

jsPsych.data.addProperties({
  subject:  var sub_id = "${l://SurveySessionID}";
});

/*defining debriefing block*/

var debrief = {
  type: "html-keyboard-response",
  stimulus: function() {
    var total_trials = jsPsych.data.get().filter({trial_type: 'html-keyboard-response'}).count();
    var accuracy = Math.round(jsPsych.data.get().filter({correct: true}).count() / total_trials * 100);
    var congruent_rt = Math.round(jsPsych.data.get().filter({correct: true, stim_type: 'congruent'}).select('rt').mean());
    var incongruent_rt = Math.round(jsPsych.data.get().filter({correct: true, stim_type: 'incongruent'}).select('rt').mean());
    return "<p>You responded correctly on <strong>"+accuracy+"%</strong> of the trials.</p> " +
    "<p>Your average response time for congruent trials was <strong>" + congruent_rt + "ms</strong>.</p>"+
    "<p>Your average response time for incongruent trials was <strong>" + incongruent_rt + "ms</strong>.</p>"+
    "<p>Press any key to complete the experiment. Thank you!</p>";
  }
};

   /*set up experiment structure*/
var timeline = [];
timeline.push(welcome);
timeline.push(instructions);
timeline.push(test);
timeline.push(debrief);
