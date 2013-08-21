(function($){$.fn.quiz=function(settings){var defaults={questions:null,twitterShareText:'I scored {score} on this awesome quiz!',facebookShareText:'I scored {score} on this awesome quiz!',twitterButtonText:'Share Result',facebookButtonText:'Share Result',introTitle:'',introContent:'',introThumb:'',noticeText:'{Warning!} Please select an option!',resultText:{perfect:'Perfect!',excellent:'Excellent!',good:'Good!',average:'Average!',bad:'Bad!',poor:'Poor!',worst:'Worst!'},startText:'Start',finishText:'Finish!',nextText:'Next',prevText:'Prev',titleBefore:'<h3>',titleAfter:'</h3>',};var options=$.extend(defaults,settings);var container=$(this);var correctAnswers=[];if(options.questions===null){container.html('<div class="intro-container quiz-container"><h3>Failed to parse questions.</h3></div>');return}$.each(options.questions,function(i){correctAnswers.push(options.questions[i].answer)});function generateQuiz(){var quizProgress='<div id="quiz-progress" class="progress"><div class="bar" style=""></div></div>',quizNotice='<div id="quiz-notice" class="alert">'+options.noticeText.replace('{','<strong>').replace('}','</strong>')+'</div>',quizQuestion='',quizResults='<div id="quiz-results" class="quiz-container"></div>',quizTemplate='',quizIntro='<div id="bon-quiz-intro-container" class="quiz-container">'+options.titleBefore+options.introTitle+options.titleAfter+'<p class="intro-content">'+options.introContent+'</p><hr/>';if(options.introThumb){quizIntro+='<img src="'+options.introThumb+'" alt="'+options.introTitle+'"/><hr />'}quizIntro+='<a class="quiz-start quiz-button" href="#">'+options.startText+'</a></div>';$.each(options.questions,function(i){quizQuestion+='<div class="quiz-container"><h4 class="question">'+options.questions[i].question+'</h4><hr />';quizQuestion+='<div class="quiz-count">Question <span class="quiz-current">'+(i+1)+'</span> of <span class="quiz-total">'+options.questions.length+'</span></div>';quizQuestion+='<ul class="options">';$.each(options.questions[i].opts,function(j){quizQuestion+='<li>'+options.questions[i].opts[j]+'</li>'});quizQuestion+='</ul><hr /><div class="quiz-button-container" cf>';if(i!==0){quizQuestion+='<a href="#" class="quiz-button quiz-prev">'+options.prevText+'</a>'}if(i<options.questions.length-1){quizQuestion+='<a href="#" class="quiz-button quiz-next">'+options.nextText+'</a>'}else{quizQuestion+='<a href="#" class="quiz-button quiz-results">'+options.finishText+'</a>'}quizQuestion+='</div></div>'});quizTemplate=quizIntro+quizQuestion+quizResults+quizNotice+quizProgress;return quizTemplate}var quiz=generateQuiz();container.html(quiz);var progress=container.find('#quiz-progress'),progressBar=container.find('.bar'),notice=container.find('#quiz-notice'),progressWidth=$('.quiz-main').width(),userAnswers=[],questionLength=options.questions.length,quizContainer=container.find('.quiz-container');progress.hide();notice.hide();quizContainer.hide().first().fadeIn(500);container.find('.options li').click(function(){var checkedOption=$(this);if(checkedOption.hasClass('selected')){checkedOption.removeClass('selected')}else{checkedOption.parents('.options').children('li').removeClass('selected');checkedOption.addClass('selected')}});container.find('.quiz-start').click(function(){$(this).parents('.quiz-container').fadeOut(500,function(){$(this).next().fadeIn(500);progress.fadeIn(500)});return false});container.find('.quiz-next').click(function(){if($(this).parents('.quiz-container').find('li.selected').length===0){notice.fadeIn(300);return false}notice.hide();$(this).parents('.quiz-container').fadeOut(500,function(){$(this).next().fadeIn(500)});progressBar.animate({width:progressBar.width()+Math.round(progressWidth/questionLength)},500);return false});container.find('.quiz-prev').click(function(){notice.hide();$(this).parents('.quiz-container').fadeOut(500,function(){$(this).prev().fadeIn(500)});progressBar.animate({width:progressBar.width()-Math.round(progressWidth/questionLength)},500);return false});container.find('.quiz-results').click(function(){if($(this).parents('.quiz-container').find('li.selected').length===0){notice.fadeIn(300);return false}container.find('li.selected').each(function(i){userAnswers.push($(this).parents('.options').children('li').index($(this).parents('.options').find('li.selected'))+1)});progress.hide();notice.hide();var finalResult=generateResults;container.find('#quiz-results').html(finalResult);$(this).parents('.quiz-container').fadeOut(500,function(){$(this).next().fadeIn(500)});return false});function checkAnswers(){var answerResults=[],flag=false;$.each(correctAnswers,function(i){if(correctAnswers[i]==userAnswers[i]){flag=true}else{flag=false}answerResults.push(flag)});return answerResults}function calculateResults(correct,len,dec){var score=correct/len*100;var result=Math.round(score*Math.pow(10,dec))/Math.pow(10,dec);return result}function generateResults(){var results=checkAnswers(),resultList='',trueAnswer=0,score=0,correctAnswerList='',resultHeader='',twitterButtonTemplate='',facebookButonTemplate='';resultList+='<div class="results-container cf">';$.each(results,function(i){if(results[i]===true){trueAnswer++;isCorrect=true}resultList+='<div class="result-each cf">';resultList+='<div class="result-list"><div class="quiz-title">Question #'+(i+1)+'</div>';correctAnswerList='<ul class=\'result-options\'>';$.each(options.questions[i].opts,function(j){var appendCorrect='<span class=\'icon correct awe-ok-sign\'></span>';var appendWrong='<span class=\'icon wrong awe-remove-sign\'></span>';var appendNormal='<span class=\'icon normal awe-circle-blank\'></span>';correctAnswerList+='<li';if(options.questions[i].answer==j+1){correctAnswerList+=' class=\' correct \'>';correctAnswerList+=appendCorrect}if(userAnswers[i]==j+1&&options.questions[i].answer!=j+1){correctAnswerList+=' class=\' wrong \'>';correctAnswerList+=appendWrong}if(userAnswers[i]!=j+1&&options.questions[i].answer!=j+1){correctAnswerList+='>';correctAnswerList+=appendNormal}correctAnswerList+=options.questions[i].opts[j]+'</li>'});correctAnswerList+='</ul>';if(results[i]===true){resultList+='<div class="quiz-answer correct">Correct</div>'}else{resultList+='<div class="quiz-answer wrong">Wrong</div>'}resultList+='</div>';resultList+='</div>'});resultList+='</div>';score=calculateResults(trueAnswer,questionLength,2);resultHeader='<h2>'+resultText(score)+' You scored: '+score+'</h2><hr />';twitterButtonTemplate='<a target="_blank" href="http://twitter.com/share?text='+options.twitterShareText.replace("{score}",score)+'&url='+location.href+'" class="quiz-button twitter"><i class="bt-twitter"></i>'+options.twitterButtonText+'</a>';facebookButonTemplate='<a target="_blank" href="http://www.facebook.com/sharer.php?s=100&p[title]='+options.facebookShareText.replace("{score}",score)+'&p[url]='+location.href+'"'+'class="quiz-button facebook"><i class="bt-facebook"></i>'+options.facebookButtonText+'</a>';resultTemplate=resultHeader+twitterButtonTemplate+facebookButonTemplate+'<hr />'+resultList;return resultTemplate}function resultText(score){var returnString;if(score==100){returnString=options.resultText.perfect}else if(score>90){returnString=options.resultText.excellent}else if(score>80){returnString=options.resultText.good}else if(score>60){returnString=options.resultText.average}else if(score>40){returnString=options.resultText.bad}else if(score>30){returnString=options.resultText.poor}else{returnString=options.resultText.worst}return returnString}}})(jQuery);