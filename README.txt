Ace HTML Editor Module
======================
by Max Nylin, max@articstudios.se



Description
===========

Ace is a code editor written in JavaScript, allowing you to edit HTML, PHP and JavaScript
in a very natural way. It provides syntax hilighting, proper indentation, keyboard shortcuts,
find and replace (incuding regular expressions), and more.

This module integrates the Ace editor into Drupals node/block edit forms, for edititing raw
HTML/PHP/JavaScript in an intuitive way.



Installation
============

1. Download the latest version of the Ace Editor at https://github.com/ajaxorg/ace/downloads
2. Extract and place the contents of the zip file under sites/all/libraries so that ace.js
   is located at sites/all/libraries/ace/src/ace.js
3. Copy the modules directory to your modules directory and activate the module in Drupal.
4. A default text format with the name "HTML Editor" is added to use the editor when editing content,
   additional text formats to use with the editor at admin/config/content/ace-editor.
5. Enjoy this freakishly fresh editor!



Features
========


Edit HTML and PHP in your nodes and blocks like a pro
-----------------------------------------------------
Go to admin/config/content/ace-editor and setup the module for use with node/block editing.
Head over to any block or node containing a textarea with the correct text format and hack away!


Output the contents of a field using code highlighting
------------------------------------------------------

Manage the display of any textarea fields attached to a node and select the "Code syntax highlighting" format.
This will output the content of that field as an editor with syntax highlighting in your node view using
the selected options.


Add an editor in your template file
-----------------------------------

You can use the built in API function ace_editor_add($content, $settings) to add an editor anywhere in your
template files. Settings is an array of key/value pairs that can contain any option specified below.


Embedd code snippets in the body of your nodes or blocks
--------------------------------------------------------

Add the "Syntax highlighting" filter to any of your text formats. The module will now convert all content
inside an <ace> tag to display the code using the Ace editor with the selected options.

You can override the default options/settings of the text filter by simply adding the settings as attributes to the <ace> tag.

Here are the possible values:

  theme
    clouds = Clouds
	clouds_midnight = Clouds Midnight
	cobalt = Cobalt
	crimson_editor = Crimson Editor
	dawn = Dawn
	idle_fingers = Idle Fingers
	kr_theme = krTheme
	merbivore = Merbivore
	merbivore_soft = Merbivore Soft
	mono_industrial = Mono Industrial
	monokai = Monokai
	pastel_on_dark = Pastel on dark
	solarized_dark = Solarized Dark
	solarized_light = Solarized Light
	textmate = TextMate
	twilight = Twilight
	tomorrow = Tomorrow
	vibrant_ink = Vibrant Ink

  syntax
    c_cpp = C/C++
	clojure = Clojure
	coffee = CoffeeScript
	csharp = C#
	css = CSS
	groovy = Groovy
	html = HTML
	java = Java
	javascript = JavaScript
	json = JSON
	ocaml = OCaml
	perl = Perl
	php = PHP
	python = Python
	scala = Scala
	scss = SCSS
	ruby = Ruby
	svg = SVG
	textile = Textile
	xml = XML

  height
	300px, 75% etc.
	
  width
    100%, 600px etc.

  fontsize
    All compatible CSS values for font-size

  linenumbers
    1 or 0 (on/off)

  printmargin
    1 or 0 (on/off)

  invisibles
    1 or 0 (on/off)

Examples:
	
	<ace theme="light" height="200px" fontsize="12pt" printmargin="1">
	<ace theme="dark" syntax="php" height="200px" width="50%">
	<ace height="100px" width="100%" invisibles="1">
