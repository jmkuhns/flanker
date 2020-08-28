// Use JSDELIVR to get the files from a GitHub repository
// https://cdn.jsdelivr.net/gh/<github-username>/<repository-name>/<specific folder or file>
//var repo_site = "https://cdn.jsdelivr.net/gh/kywch/jsPsych-in-Qualtrics/flanker/ArrowFlankerBitmaps";
//var repo_site = "https://jmkuhns.github.io/flanker/";
var timeline = [];
var flanker_bitmaps = "https://jmkuhns.github.io/flanker/ArrowFlankersBitmaps/";

// how many trials????????????????/
/* experiment parameters */
var reps_per_trial_type = 1;

/*set up welcome block*/
var welcome = {
  type: "html-keyboard-response",
  stimulus: "Welcome to the experiment. Press any key to begin."
};
timeline.push(welcome);
/*set up instructions block*/
var instructions = {
  type: "html-keyboard-response",
  stimulus:
  "<p> In this task, there will be a plus sign (+) in the center of the screen.</p>"+
  "<p> It is very important that you try to keep your eyes on the plus sign throughout the experiment.</p>"+
  "<p> Your goal in this experiment is to decide which direction an arrow is pointing. <br> The arrows will appear above the plus sign.  However, you should still try not to move your eyes from the plus sign.</p>"+
  "<p> Please press enter to continue </p>",
  post_trial_gap: 1000
};
var instructions2 = {
  type: "html-keyboard-response",
  stimulus:
   "<p>In this task, you will see five arrows on the screen, like the example below.</p>" +
    "<img src='https://jmkuhns.github.io/flanker/ArrowFlankersBitmaps/L.png' style= "width:90px;height:20px;" ></img>" +
    "<p>Press the left arrow key if the middle arrow is pointing left. (<)</p>" +
    "<p>Press the right arrow key if the middle arrow is pointing right. (>)</p>" +
    "<p>Press any key to begin.</p>",
  post_trial_gap: 1000
};
timeline.push(instructions, instructions2);



var fixation = {
      type: 'html-keyboard-response',
      stimulus: '<div style="font-size:60px;">+</div>',
      choices: jsPsych.NO_KEYS,
      trial_duration: function() {
                    return Math.floor(Math.random() * 1500) + 500;
                },
      data: {test_part: 'fixation'}
    };

/*defining stimuli*/
var test_stimuli = [
  {
    stimulus: flanker_bitmaps + "RH.png",
    data: { stim_type: 'congruent', direction: 'right'}
  },
  {
    stimulus: flanker_bitmaps + "LH.png",
    data: { stim_type: 'congruent', direction: 'left'}
  },
  {
    stimulus: flanker_bitmaps + "LRL.png",
    data: { stim_type: 'incongruent', direction: 'right'}
  },
  {
    stimulus: flanker_bitmaps + "RLR.png",
    data: { stim_type: 'incongruent', direction: 'left'}
  },
  {
    stimulus: flanker_bitmaps + "dotL.png",
    data: { stim_type: 'neutral', direction: 'left'}
  },
  {
    stimulus: flanker_bitmaps + "dotR.png",
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
    }
  }],
  timeline_variables: [
    fixation,
    test_stimuli
  ],
  sample: {type:
    //'fixed-repetitions',
    'alternate-groups',
    groups:[[0], [1]], // 0 is fixation, 1 is test_stimuli...
    randomize_group_order: false // the first trial will be an item from group 1
    size: reps_per_trial_type}
};


timeline.push(test);

/*defining debriefing block*/
var debrief = {
  type: "html-keyboard-response",
  stimulus: function() {
    //var bar = JSON.stringify(jsPsych.data.get().json());
    //console.log(bar);
    var total_trials = jsPsych.data.get().filter({trial_type: 'image-keyboard-response'}).count();
    var accuracy = Math.round(jsPsych.data.get().filter({correct: true}).count() / total_trials * 100);
    var congruent_rt = Math.round(jsPsych.data.get().filter({correct: true, stim_type: 'congruent'}).select('rt').mean());
    var incongruent_rt = Math.round(jsPsych.data.get().filter({correct: true, stim_type: 'incongruent'}).select('rt').mean());
    return "<p>You responded correctly on <strong>"+accuracy+"%</strong> of the trials.</p> " +
    "<p>Your average response time for congruent trials was <strong>" + congruent_rt + "ms</strong>.</p>"+
    "<p>Your average response time for incongruent trials was <strong>" + incongruent_rt + "ms</strong>.</p>"+
    "<p>Press any key to complete the experiment. Thank you!</p>"
  }
};

/*set up experiment structure*/

timeline.push(debrief);
