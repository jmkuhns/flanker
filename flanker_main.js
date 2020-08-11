<!-- CHANGE 1: Using the GitHub-hosted files -->
<script src="https://jmkuhns.github.io/flanker/jspsych-6-2/jspsych.js" charset="utf-8"></script>
<script src="https://jmkuhns.github.io/flanker/jspsych-6-2/plugins/jspsych-html-keyboard-response.js" charset="utf-8"></script>
<link rel="stylesheet" href="https://jmkuhns.github.io/flanker/jspsych-6-2/css/jspsych.css">
<!-- CHANGE 2: Loading the main experiment script in the same folder-->
<script src="https://jmkuhns.github.io/flanker/flanker_main.js"></script>

// Use JSDELIVR to get the files from a GitHub repository
// https://cdn.jsdelivr.net/gh/<github-username>/<repository-name>/<specific folder or file>
//var repo_site = "https://cdn.jsdelivr.net/gh/kywch/jsPsych-in-Qualtrics/flanker/ArrowFlankerBitmaps";
//var repo_site = "https://jmkuhns.github.io/flanker/";
var flanker_bitmaps = "https://jmkuhns.github.io/flanker/ArrowFlankerBitmaps";

/* experiment parameters */
var reps_per_trial_type = 4;

/*set up welcome block*/
var welcome = {
  type: "html-keyboard-response",
  stimulus: "Welcome to the experiment. Press any key to begin."
};

/*set up instructions block*/
var instructions = {
  type: "html-keyboard-response",
  stimulus:
  "<p> In this task, there will be a plus sign (+) in the center of the screen.</p>"
  "<p> It is very important that you try to keep your eyes on the plus sign throughout the experiment.</p>""
  "<p> Your goal in this experiment is to decide which direction an arrow is pointing. <br> The arrows will appear above the plus sign.  However, you should still try not to move your eyes from the plus sign.</p>"
  "<p> Please press enter to continue </p>"


  stimulus: "<p>In this task, you will see five arrows on the screen, like the example below.</p>" +
    "<img src='" + flanker_bitmaps + "L.bmp'></img>" +
    "<p>Press the left arrow key if the middle arrow is pointing left. (<)</p>" +
    "<p>Press the right arrow key if the middle arrow is pointing right. (>)</p>" +
    "<p>Press any key to begin.</p>",
  post_trial_gap: 1000
};

/*defining stimuli*/
var test_stimuli = [
  {
    stimulus: flanker_bitmaps + "RH.bmp"
    data: { stim_type: 'congruent', direction: 'right'}
  },
  {
    stimulus: flanker_bitmaps + "LH.bmp",
    data: { stim_type: 'congruent', direction: 'left'}
  },
  {
    stimulus: flanker_bitmaps + "LRL.bmp",
    data: { stim_type: 'incongruent', direction: 'right'}
  },
  {
    stimulus: flanker_bitmaps + "RLR.bmp",
    data: { stim_type: 'incongruent', direction: 'left'}
  },
  {
    stimulus: flanker_bitmaps + "dotL.bmp",
    data: { stim_type: 'neutral', direction: 'left'}
  },
  {
    stimulus: flanker_bitmaps + "dotR.bmp",
    data: { stim_type: 'neutral', direction: 'right'}
  }
];

/* defining test timeline */
var test = {
  timeline: [{
    type: 'image-keyboard-response',
    choices: [37, 39],
    trial_duration: 1500,
    stimulus: jsPsych.timelineVariable('stimulus'),
    data: jsPsych.timelineVariable('data'),
    on_finish: function(data){
      var correct = false;
      if(data.direction == 'left' &&  data.key_press == 37 && data.rt > -1){
        correct = true;
      } else if(data.direction == 'right' && data.key_press == 39 && data.rt > -1){
        correct = true;
      }
      data.correct = correct;
    },
    post_trial_gap: function() {
        return Math.floor(Math.random() * 1500) + 500;
    }
  }],
  timeline_variables: test_stimuli,
  sample: {type: 'fixed-repetitions', size: reps_per_trial_type}
};

/*defining debriefing block*/
var debrief = {
  type: "html-keyboard-response",
  stimulus: function() {
    var total_trials = jsPsych.data.get().filter({trial_type: 'image-keyboard-response'}).count();
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
