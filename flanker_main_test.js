// Use JSDELIVR to get the files from a GitHub repository
// https://cdn.jsdelivr.net/gh/<github-username>/<repository-name>/<specific folder or file>
//var repo_site = "https://cdn.jsdelivr.net/gh/kywch/jsPsych-in-Qualtrics/flanker/ArrowFlankerBitmaps";
//var repo_site = "https://jmkuhns.github.io/flanker/";
var timeline = [];
// var flanker_bitmaps = "https://jmkuhns.github.io/flanker/ArrowFlankersBitmaps/";

/*set up welcome block*/
var welcome = {
  type: "html-keyboard-response",
  stimulus: "Welcome to the Flanker task. Press any key to begin."
};
timeline.push(welcome);
/*set up instructions block*/
var instructions = {
  type: "html-keyboard-response",
  stimulus:
  '<p style:"font-size:30px">FLANKER TASK</p>' +
  '<br><br><p><p> In this task, there will be a plus sign (+) in the center of the screen.</p>'+
  "<p> It is very important that you try to keep your eyes on the plus sign throughout the experiment.</p>"+
  "<p> Your goal in this experiment is to decide which direction an arrow is pointing. <br> The arrows will appear above the plus sign.  However, you should still try not to move your eyes from the plus sign.</p>"+
  "<br><p>Please press any key to continue </p>",
  post_trial_gap: 250
};
var instructions2 = {
  type: "html-keyboard-response",
  stimulus:
   "<p>In this task, you will see five arrows on the screen, like the example below.</p><br>" +
   "<p 'font-size: 36px'> < </p><br>" +
    "<p>Press the left arrow key if the middle arrow is pointing left. (<)</p>" +
    "<p>Press the right arrow key if the middle arrow is pointing right. (>)</p>" +
    "<br><p>Press any key to complete a practice block.</p>",
  post_trial_gap: 250
};
timeline.push(instructions, instructions2);

// how many trials????????????????/
/* experiment parameters */
var reps_per_practice = 1; // 1 * 6 = 6
var reps_per_trial_type = 9; // 9 * 6 = 54

var fixation = {
      type: 'html-keyboard-response',
      stimulus: '<div style="font-size:40px;">+</div>',
      choices: jsPsych.NO_KEYS,
      trial_duration: function() {
                    return Math.floor(Math.random() * 750) + 500;
                },
      data: {exp_stage: 'fixation'}
    };

/*defining stimuli*/
var test_stimuli = [
  {
    stimulus: "<p 'font-size: 36px'> >>>>> </p>",
    data: {exp_stage: 'trial' , stim_type: 'congruent', direction: 'right'}
  },
  {
    stimulus: "<p 'font-size: 36px'> <<<<< </p>",
    data: {exp_stage: 'trial' ,  stim_type: 'congruent', direction: 'left'}
  },
  {
    stimulus: "<p 'font-size: 36px'> <<><< </p>",
    data: {exp_stage: 'trial' ,  stim_type: 'incongruent', direction: 'right'}
  },
  {
    stimulus: "<p 'font-size: 36px'> >><>> </p>",
    data: {exp_stage: 'trial' ,  stim_type: 'incongruent', direction: 'left'}
  },
  {
    stimulus: "<p 'font-size: 36px'> · · < · · </p>",
    data: {exp_stage: 'trial' ,  stim_type: 'neutral', direction: 'left'}
  },
  {
    stimulus: "<p 'font-size: 36px'> · · > · · </p>",
    data: {exp_stage: 'trial' ,  stim_type: 'neutral', direction: 'right'}
  }
];

var test = {
  type: "html-keyboard-response",
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
}

var test_practice = {
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  data: {
    exp_stage: "practice"
  },
  sample: {
    type: 'fixed-repetitions',
    size: reps_per_practice
  }
};
var prac_debrief = {
  type: "html-keyboard-response",
  stimulus: "<p>You have now completed the practice trials. Press any key to begin the task.</p>",
  data: {exp_stage: "instructions"}
}

var test_proc ={
  timeline: [fixation, test],
  timeline_variables: test_stimuli,
  data: {
    exp_stage: "flanker"
  },
  sample: {
    type: 'fixed-repetitions', // Repeat each item in the timeline variables size times, in a random order
    size: reps_per_trial_type
  }
};


timeline.push(test_practice);


timeline.push(prac_debrief);
//timeline.push(test_proc);

/*defining debriefing block*/
var debrief = {
  type: "html-keyboard-response",
  stimulus: "<p>Press any key to proceed to the next task. Thank you!</p>",
  data:{exp_stage: "instructions"}
};

/*set up experiment structure*/

timeline.push(debrief);
