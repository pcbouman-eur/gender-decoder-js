/*
The MIT License (MIT)

Copyright (c) 2018 Paul Bouman, 2016 lovedaybrooke

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function assess(ad_text, wordlists) {
   // Extract the data lists
   var feminine = wordlists['feminine_words'];
   var masculine = wordlists['masculine_words'];
   // Remove hyphens in words
   var stripped = ad_text.replace(/(\w)-(\w)/g,'$1$2');
   // Remove hypens across lines
   var stripped = stripped.replace(/(\w)-\s*\n\s*(\w)/g, '$1$2');
   // Remove all characters that are not word or space related
   stripped = stripped.replace(/[^\w\s]/g,' ');
   // Reduce all multiple spaces into a single space
   var reduced = stripped.replace(/\s+/g,' ');
   // Split the remaining text into words
   var split = reduced.toLowerCase().split(' ');
   var result = { 'masculine_words' : [], 'feminine_words' : []};
   for (var i=0; i < split.length; i++) {
      var word = split[i];
      // Detect a feminine word
      for (var j=0; j < feminine.length; j++) {
         if (word.startsWith(feminine[j].toLowerCase())) {
            result['feminine_words'].push(word);
            break;
         }
      }
      // Detect a masculine word
      for (var j=0; j < masculine.length; j++) {
         if (word.startsWith(masculine[j].toLowerCase())) {
            result['masculine_words'].push(word);
            break;
         }
      }
   }

   var masCount = result['masculine_words'].length;
   var femCount = result['feminine_words'].length;
   var ratio = masCount/femCount;

   // Decision tree to come to a verdict
   var verdict;
   if (masCount > 0 && femCount == 0) {
      verdict = 'strongly masculine-coded';
   }
   else if (masCount == 0 && femCount > 0) {
      verdict = 'strongly feminine-coded';
   }
   else if (masCount == 0 && femCount == 0) {
      verdict = 'neutral';
   }
   else if (ratio == 1) {
      verdict = 'neutral';
   }
   else if (ratio <= 0.5 && femCount > 5) {
      verdict = 'strongly feminine-coded';
   }
   else if (ratio >= 2 && masCount > 5) {
      verdict = 'strongly masculine-coded';
   }
   else if (ratio > 1) {
      verdict = 'masculine coded';
   }
   else {
      verdict = 'feminine coded';
   }
   result['verdict'] = verdict;

   if (verdict.includes('feminine')) {
      result['explanation'] = "This job ad uses more words that are stereotypically feminine "
         + "than words that are stereotypically masculine. Fortunately, the research "
         + "suggests this will have only a slight effect on how appealing the job is "
         + "to men, and will encourage women applicants.";
   }
   else if (verdict.includes('masculine')) {
      result['explanation'] = "This job ad uses more words that are stereotypically masculine "
            + "than words that are stereotypically feminine. It risks putting women off "
            + "applying, but will probably encourage men to apply.";
      }
   else if (masCount == 0 && femCount == 0) {
      result['explanation'] = "This job ad doesn't use any words that are stereotypically "
            + "masculine and stereotypically feminine. It probably won't be off-putting "
            + "to men or women applicants.";
   }
   else {
      result['explanation'] = "This job ad uses an equal number of words that are "
           + "stereotypically masculine and stereotypically feminine. It probably won't "
           + "be off-putting to men or women applicants.";
   }
   
   return result;
}
