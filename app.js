/*
The MIT License (MIT)

Copyright (c) 2018 Paul Bouman

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


// Initialize the webpage
function init() {
   var ls = window.localStorage;
   if (ls.getItem('feminine_words') != null)
   {
      document.getElementById('feminine_text').value = ls.getItem('feminine_words');
      document.getElementById('masculine_text').value = ls.getItem('masculine_words');
   }
   else
   {
      reset();
   }
}

function clickReset() {
   if (confirm('This will reset both the masculine and the feminine wordlist, removing everything that is currently there. Are you sure you want to continue?'))
   {
      reset();
   }
}

// Used to store lists in local storage so they are pesisted if the user closes the browser
function storeLists() {
   var ls = window.localStorage;
   var fem_val = document.getElementById('feminine_text').value;
   var mas_val = document.getElementById('masculine_text').value;
   ls.setItem('feminine_words', fem_val);
   ls.setItem('masculine_words', mas_val);
}

// Resets the word lists to the default ones
function reset() {
   var lists = getWordLists();
   var fem_val = lists['feminine_words'].join('\n');
   var mas_val = lists['masculine_words'].join('\n');
   var fem_div = document.getElementById('feminine_text');
   fem_div.value = fem_val;
   var mas_div = document.getElementById('masculine_text');
   mas_div.value = mas_val;
}

function getLists() {
   var fem_val = document.getElementById('feminine_text').value;
   var fem_lst = fem_val.split('\n');
   var mas_val = document.getElementById('masculine_text').value;
   var mas_lst = mas_val.split('\n');
   return { 'masculine_words' : mas_lst, 'feminine_words' : fem_lst }; 
}

// Take the data from the page, run the analysis and inject a report
function analyze() {
   // Extra text and run the assessment function on it
   var resDiv = document.getElementById('result');
   var ad = document.getElementById('ad_text');
   var text = ad.value;
   if (text.trim().length == 0) {
      alert('Please enter an advertisment to analyze');
      resDiv.innerHTML = '';
      return;
   }
   var response = assess(text, getLists());
   
   // Build a report based on the output of the assessment function
   var report = '<h3>The Verdict</h3><p>The provided text is: ' + response['verdict'] +'</p>';
   report += '<h3>Explanation</h3><p>' + response['explanation'] + '</p>';
   if (response['masculine_words'].length > 0) {
      report += '<h3>List of masculine words</h3><ul>';
      response['masculine_words'].forEach(function (mw) { 
         report += '<li>'+mw+'</li>'; 
      });
      report += '</ul>';
   }
   if (response['feminine_words'].length > 0) { 
      report += '<h3>List of feminine words</h3><ul>';
      response['feminine_words'].forEach(function (mw) {
         report += '<li>'+mw+'</li>';
      });
      report += '</ul>';
   }
   
   // Inject the response into the appropiate div
  resDiv.innerHTML = report;
}

