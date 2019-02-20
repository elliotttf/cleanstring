
[![Greenkeeper badge](https://badges.greenkeeper.io/elliotttf/cleanstring.svg)](https://greenkeeper.io/)

<!--
  This file was generated by emdaer

  Its template can be found at .emdaer/README.emdaer.md
-->

<!--
  emdaerHash:eb8b1252e987a6f641b28b8b7f8e2656
-->

<h1 id="path-cleanstring">path-cleanstring</h1>
<p><a href="https://travis-ci.org/elliotttf/cleanstring"><img src="https://travis-ci.org/elliotttf/cleanstring.svg?branch=master" alt="Build Status"></a>
<a href="https://github.com/emdaer/emdaer"><img src="https://img.shields.io/badge/📓-documented%20with%20emdaer-F06632.svg?style=flat-square" alt="Documented with emdaer"></a></p>
<p>This module can be used to generate clean strings that can be used in URIs, etc.
Its implementation is based on and intended to be used in parallel with the
Drupal module <a href="https://www.drupal.org/project/pathauto">pathauto</a>‘s <a href="http://api.drupalhelp.net/api/pathauto/pathauto.inc/function/pathauto_cleanstring/7">pathauto_cleanstring</a> method.</p>
<h2 id="api">API</h2>
<!-- Generated by documentation.js. Update this documentation by updating the source code. -->
<h2 id="cleanstring_remove">CLEANSTRING_REMOVE</h2>
<p>Constant for remove action.</p>
<p>Type: <a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></p>
<h2 id="cleanstring_replace">CLEANSTRING_REPLACE</h2>
<p>Constant for replace action.</p>
<p>Type: <a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></p>
<h2 id="cleanstring_donothing">CLEANSTRING_DONOTHING</h2>
<p>Constant for do nothing action.</p>
<p>Type: <a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></p>
<h2 id="cleanstring">cleanstring</h2>
<p>Constructs a method for cleaning strings.</p>
<p>Note: passed in config is merged
  with the default config, but not recursively. Therefore, if you override one
  of the arrays or objects in the config you must provide all the members that
  you would like that array or object to contain.</p>
<p><strong>Parameters</strong></p>
<ul>
<li><code>config</code> <strong>CleanstringConfig</strong> The config object to use for cleaning. Anything passed in here will be
  merged with the default config, but not recursively, i.e. if you override
  config.punctuation you will need to provide values for every punctionation
  character you wish to handle. (optional, default <code>defaultConfig</code>)<ul>
<li><code>config.case</code> <strong><a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></strong> True if the generated string should be lowercased. (optional, default <code>true</code>)</li>
<li><code>config.ignoreWords</code> <strong><a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array">Array</a>&lt;<a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String">string</a>&gt;</strong> The list of words to strip from the passed in string. (optional, default <code>[&#39;a&#39;,&#39;an&#39;,&#39;as&#39;,&#39;at&#39;,&#39;before&#39;,&#39;but&#39;,&#39;by&#39;,&#39;for&#39;,&#39;from&#39;,&#39;is&#39;,&#39;in&#39;,&#39;into&#39;,&#39;like&#39;,&#39;of&#39;,&#39;off&#39;,&#39;on&#39;,&#39;onto&#39;,&#39;per&#39;,&#39;since&#39;,&#39;than&#39;,&#39;the&#39;,&#39;this&#39;,&#39;that&#39;,&#39;to&#39;,&#39;up&#39;,&#39;via&#39;,&#39;with&#39;]</code>)</li>
<li><code>config.maxComponentLength</code> <strong>int</strong> The maximum length of the resulting string. The string will be split on
  boundaries so it may be shorter than this value, but will never be longer. (optional, default <code>100</code>)</li>
<li><code>config.punctuation</code> <strong><a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object">Object</a></strong> The punctuation directives, each member of this object will have a value of
  CLEANSTRING_REMOVE, CLEANSTRING_REPLACE, or CLEANSTRING_DONOTHING which
  will determine how the characters are handled during cleaning (optional, default <code>{
&#39;&quot;&#39;:CLEANSTRING_REMOVE,
&quot;&#39;&quot;:CLEANSTRING_REMOVE,
&#39;`&#39;:CLEANSTRING_REMOVE,
&#39;,&#39;:CLEANSTRING_REMOVE,
&#39;.&#39;:CLEANSTRING_REMOVE,
&#39;-&#39;:CLEANSTRING_REMOVE,
_:CLEANSTRING_REMOVE,
&#39;:&#39;:CLEANSTRING_REMOVE,
&#39;;&#39;:CLEANSTRING_REMOVE,
&#39;|&#39;:CLEANSTRING_REMOVE,
&#39;{&#39;:CLEANSTRING_REMOVE,
&#39;}&#39;:CLEANSTRING_REMOVE,
&#39;[&#39;:CLEANSTRING_REMOVE,
&#39;]&#39;:CLEANSTRING_REMOVE,
&#39;+&#39;:CLEANSTRING_REMOVE,
&#39;</code>)</li>
<li><code>config.reduceAscii</code> <strong><a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean">boolean</a></strong> True if the generated string should have all non-ascii characters removed. (optional, default <code>false</code>)</li>
<li><code>config.separator</code> <strong><a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></strong> The character to use to separate words on boundaries. (optional, default <code>&#39;-&#39;</code>)</li>
</ul>
</li>
</ul>
<p>Returns <strong><a href="#cleanstringcallback">CleanstringCallback</a></strong> A function which can be used to clean strings. Accepts a string as its only
  parameter and will return a string cleaned according to the settings
  provided.</p>
<h2 id="cleanstringcallback">CleanstringCallback</h2>
<p>Method to clean a string according to config.</p>
<p>Type: <a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function">Function</a></p>
<p><strong>Parameters</strong></p>
<ul>
<li><code>string</code> <strong><a href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String">string</a></strong> The string to clean.</li>
</ul>
