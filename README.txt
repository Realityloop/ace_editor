Ace Editor Module ( https://drupal.org/project/ace_editor )
======================
by Max Nylin, max@articstudios.se
by Olivier GIRARD, girardol182@gmail.com
by interdruper, https://www.drupal.org/u/interdruper


Description
===========

AceEditor is a code editor written in JavaScript, allowing you to edit HTML,
PHP and JavaScript (and more). It provides syntax highlighting, proper
indentation, keyboard shortcuts, find and replace (including regular
expressions).

This module integrates the Ace editor into Drupal's node/block edit forms,
for editing raw HTML/PHP/JavaScript (with more) in a familiar way.
It also provides a display formatter, along with a text filter and
an API to embed and show code snippets in your content.


Installation
============

a) Using Drush (recommended from 7.x-1.2):
     Just run 'drush en ace_editor'. The module will be downloaded and enabled.
     While enabling, you will be asked to pick the desired Ace library release
     to be installed in sites/all/libraries. Drush will download and extract
     the Ace library using the command 'drush dl-ace'.

     An new "Ace Editor" filter format is added. It uses the Ace editor
     for editing content. You can enable the Ace editor also for any other
     filter formats at admin/config/content/ace-editor.

b) Manually:
    1. Make sure that Libraries 7.x-2.x module is installed and enabled.
    2. Download the latest version of the Ace Editor at
       https://github.com/ajaxorg/ace-builds/ or directly
       via https://github.com/ajaxorg/ace-builds/archive/master.zip
       Do not use a version < 1.0.0.
    3. Extract and place the contents of the zip file under
       sites/all/libraries so that ace.js is located at
       sites/all/libraries/ace/src/ace.js. If you want to use any other src
       (minified, noconflict...), make sure that you rename the folder as "src"
       for allowing the module to find it.
    4. Download, extract and copy the ace_editor module to your
       sites/all/modules or sites/all/modules/contrib directory.
    5. Enable the "Ace HTML Editor" module on your Drupal Modules page,
       under the Administration heading. An example "Ace Editor" filter format
       is added that uses the Ace editor for editing content. You can enable the
       Ace editor for other filter formats at admin/config/content/ace-editor.

Uninstallation
==============

The module adds a filter format named 'Ace Editor' on installation. This filter
format is not disabled when the module is uninstalled, to preserve any content
saved using it. If you are sure that there is no valuable content in your
database saved under the 'Ace Editor' filter format, you can manually disable the
filter format at admin/config/content/formats.

Drush support
=============

The module offers the Drush command 'dl-ace', for easily install and/or upgrade
the Ace library in sites/all/libraries. Please run 'drush dl-ace --help' for
details.

Dependencies
============

Libraries API module (https://www.drupal.org/project/libraries)


Features
========

Edit HTML and PHP in your nodes and blocks like a pro
-----------------------------------------------------

Go to admin/config/content/ace-editor and configure the module for
node/block editing. Then head over to a block or node containing a textarea
with the correct text format and hack away!

Autocompletion
--------------

Press Ctrl+Space to use the autocomplete option while coding.

Display fields using syntax highlighting
----------------------------------------------

Manage the display of any text area fields attached to a node and select
the "Code syntax highlighting" format. This outputs the content of the field
as a ready-only editor, with syntax highlighting in your node view using
the selected options.


Use syntax hilighting from your template files
-----------------------------------------------------

You can use the ace_editor_add($content, $settings) function to add
syntax-highlighting code display anywhere in your template files.
An optional array contains settings as shown below.


Embed code snippets in the body of your nodes or blocks
---------------------------------------------------------------

Add the syntax highlighting filter to any of your text formats. The module
displays text inside an <ace> tag as code using the custom formatting options
specified as attributes to the <ace> tag.

You can override the default options by adding attributes to the <ace> tag:

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

    ... and any other theme-*.js file available in sites\all\libraries\ace\src

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

    ... and any other mode-*.js file available in sites\all\libraries\ace\src

  height
    auto, 300px, 75% etc.

  width
    100%, 600px etc.

  font-size
    All compatible CSS values for font-size

  line-numbers
    1 or 0 (on/off)

  print-margin
    1 or 0 (on/off)

  invisibles
    1 or 0 (on/off)

Examples:
      <ace theme="textmate" height="200px" font-size="12pt" print-margin="1">
      <ace theme="twilight" syntax="php" height="200px" width="50%">
      <ace height="100px" width="100%" invisibles="1">
