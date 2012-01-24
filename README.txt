Ace HTML Editor Module
======================
by Max Nylin, max@articstudios.se



Description
===========

Ace is a code editor written in JavaScript, allowing you to edit HTML, PHP and JavaScript
in a very natural way. It provides syntax hilighting, proper indentation, keyboard shortcuts,
find and replace (incuding regular expressions), and more.

This module integrates the Ace editor into Drupal's node/block edit forms, for edititing raw
HTML/PHP/JavaScript in an intuitive way.



Installation
============

1. Download the latest version of the Ace Editor at https://github.com/ajaxorg/ace/downloads
2. Extract and place the contents of the zip file under sites/all/libraries so that ace.js
   is located at sites/all/libraries/ace/src/ace.js
3. Copy the module's directory to your modules directory and activate the module in Drupal.
4. A default text format with the name "HTML Editor" is added to use the editor when editing content,
   additional text formats to use with the editor at 'admin/config/content/ace-editor'.
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


Embedd code snippets in the body of your nodes or blocks
--------------------------------------------------------

Add the "Syntax highlighting" filter to any of your text formats. The module will now convert all content
inside an [editor]-tag to display the code using the Ace editor with the selected options.