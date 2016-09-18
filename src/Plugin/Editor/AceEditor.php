<?php

namespace Drupal\ace_editor\Plugin\Editor;

use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\ckeditor\CKEditorPluginManager;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Render\Element;
use Drupal\Core\Render\RendererInterface;
use Drupal\editor\Plugin\EditorBase;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\editor\Entity\Editor;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Defines a Ace Editor based text editor for Drupal.
 *
 * @Editor(
 *   id = "ace_editor",
 *   label = @Translation("Ace Editor"),
 *   supports_content_filtering = TRUE,
 *   supports_inline_editing = FALSE,
 *   is_xss_safe = FALSE,
 *   supported_element_types = {
 *     "textarea"
 *   }
 * )
 */
class AceEditor extends EditorBase implements ContainerFactoryPluginInterface {

  /**
   * The module handler to invoke hooks on.
   *
   * @var \Drupal\Core\Extension\ModuleHandlerInterface
   */
  protected $moduleHandler;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * The renderer.
   *
   * @var \Drupal\Core\Render\RendererInterface
   */
  protected $renderer;

  /**
   * Constructs a Drupal\Component\Plugin\PluginBase object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler to invoke hooks on.
   * @param \Drupal\Core\Language\LanguageManagerInterface $language_manager
   *   The language manager.
   * @param \Drupal\Core\Render\RendererInterface $renderer
   *   The renderer.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, ModuleHandlerInterface $module_handler, LanguageManagerInterface $language_manager, RendererInterface $renderer) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->moduleHandler = $module_handler;
    $this->languageManager = $language_manager;
    $this->renderer = $renderer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('module_handler'),
      $container->get('language_manager'),
      $container->get('renderer')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getDefaultSettings() {
    return [
      'autocomplete'     => TRUE,
      'autowrap'         => TRUE,
      'codefolding'      => 'markbegin',
      'default_syntax'   => 'html',
      'fontsize'         => '12pt',
      'invisibles'       => FALSE,
      'livehighlighting' => TRUE,
      'line_numbers'     => TRUE,
      'printmargin'      => FALSE,
      'tabsize'          => 2,
      'theme'            => 'cobalt',
    ];

//    'autocomplete'     => FALSE,
//    'autowrap'         => TRUE,
//    'font-size'        => variable_get('ace_editor_fontsize', '12pt'),
//    'height'           => '200px',
//    'invisibles'       => FALSE,
//    'line-numbers'     => FALSE,
//    'linehighlighting' => TRUE,
//    'print-margin'     => FALSE,
//    'syntax'           => variable_get('ace_editor_default_syntax', 'html'),
//    'tabsize'          => variable_get('ace_editor_tabsize', 2),
//    'theme'            => variable_get('ace_editor_theme', 'cobalt'),
//    'width'            => '100%',
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state, Editor $editor) {
    $settings = $editor->getSettings();

    $form['theme'] = [
      '#type'          => 'select',
      '#title'         => $this->t('Editor theme'),
      '#description'   => $this->t('You can check the availables themes <a href="http://ace.c9.io/build/kitchen-sink.html" target="_blank">here.</a>'),
      '#options'       => ace_editor_get_themes(),
      '#default_value' => $settings['theme'],
      '#attributes'    => [
        'style' => 'min-width: 400px;',
      ],
    ];

    $form['default_syntax'] = [
      '#title'         => $this->t('Editor default syntax'),
      '#type'          => 'select',
      '#options'       => ace_editor_get_modes(),
      '#default_value' => $settings['default_syntax'],
      '#attributes'    => [
        'style' => 'min-width: 400px;',
      ],
    ];

    $form['fontsize'] = [
      '#type'          => 'select',
      '#title'         => $this->t('Font size'),
      '#options'       => [
        '8pt'  => '8pt',
        '9pt'  => '9pt',
        '10pt' => '10pt',
        '11pt' => '11pt',
        '12pt' => '12pt',
        '13pt' => '13pt',
        '14pt' => '14pt',
      ],
      '#default_value' => $settings['fontsize'],
      '#attributes'    => [
        'style' => 'min-width: 75px;',
      ],
    ];

    $form['printmargin'] = [
      '#type'          => 'checkbox',
      '#title'         => $this->t('Show print margin'),
      '#default_value' => $settings['printmargin'],
    ];

    $form['autowrap'] = [
      '#type'          => 'checkbox',
      '#title'         => $this->t('Autowrap lines'),
      '#default_value' => $settings['autowrap'],
    ];

    $form['linehighlighting'] = [
      '#type'          => 'checkbox',
      '#title'         => $this->t('Line highlighting'),
      '#default_value' => $settings['linehighlighting'],
    ];

    $form['codefolding'] = [
      '#type'          => 'select',
      '#title'         => $this->t('Code folding'),
      '#options'       => [
        'manual'       => 'disabled',
        'markbegin'    => 'mark begin',
        'markbeginend' => 'mark begin and end',
      ],
      '#default_value' => $settings['codefolding'],
    ];

    $form['tabsize'] = [
      '#type'          => 'select',
      '#title'         => $this->t('Tab size'),
      '#options'       => [
        1 => 1,
        2 => 2,
        3 => 3,
        4 => 4,
        5 => 5,
        6 => 6,
        7 => 7,
        8 => 8,
      ],
      '#default_value' => $settings['tabsize'],
      '#attributes'    => [
        'style' => 'min-width: 75px;',
      ],
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function getJSSettings(Editor $editor) {
    global $base_path;

    /** @var \Drupal\libraries\ExternalLibrary\LibraryManager $libraries_manager */
    $libraries_manager = \Drupal::service('libraries.manager');
    $library = $libraries_manager->getLibrary('ace');

    $settings = [
      'ace_src_dir'      => $base_path . $library->getLocalPath() . '/src/',
      'autocomplete'     => $editor->getSettings()['autocomplete'],
      'autowrap'         => $editor->getSettings()['autowrap'],
//      'available_modes'  => ace_editor_get_modes(),
      'fontsize'         => $editor->getSettings()['fontsize'],
      'invisibles'       => $editor->getSettings()['invisibles'],
      'linehighlighting' => $editor->getSettings()['linehighlighting'],
      'line_numbers'     => $editor->getSettings()['line_numbers'],
      'printmargin'      => $editor->getSettings()['printmargin'],
      'codefolding'      => $editor->getSettings()['codefolding'],
//      'syntax'           => variable_get('ace_editor_default_syntax', 'html'),
      'tabsize'          => $editor->getSettings()['tabsize'],
//      'text_formats'     => array_values(variable_get('ace_editor_filter_formats', [])),
      'theme'            => $editor->getSettings()['theme'],
    ];


//    global $base_path;
//
//    $addJsSettings = [
//      'ace_src_dir'      => $base_path . libraries_get_path('ace') . '/src/',
//      'autocomplete'     => variable_get('ace_editor_autocomplete', TRUE),
//      'autowrap'         => variable_get('ace_editor_autowrap', TRUE),
//      'available_modes'  => ace_editor_get_modes(),
//      'fontsize'         => variable_get('ace_editor_fontsize', '12pt'),
//      'invisibles'       => variable_get('ace_editor_invisibles', FALSE),
//      'linehighlighting' => variable_get('ace_editor_linehighlighting', TRUE),
//      'line_numbers'     => variable_get('ace_editor_line_numbers', TRUE),
//      'printmargin'      => variable_get('ace_editor_printmargin', FALSE),
//      'codefolding'      => variable_get('ace_editor_codefolding', 'markbegin'),
//      'syntax'           => variable_get('ace_editor_default_syntax', 'html'),
//      'tabsize'          => variable_get('ace_editor_tabsize', 2),
//      'text_formats'     => array_values(variable_get('ace_editor_filter_formats', [])),
//      'theme'            => variable_get('ace_editor_theme', 'cobalt'),
//    ];
//
//    $jsSettings = [
//      'ace_editor' => [
//        'admin' => $addJsSettings,
//      ],
//    ];
//
//    ace_editor_add_js($addJsSettings, TRUE);
//    drupal_add_js($jsSettings, 'setting');
//    drupal_add_js(drupal_get_path('module', 'ace_editor') . '/js/ace_editor.admin.js');
//    drupal_add_css(drupal_get_path('module', 'ace_editor') . '/styles/ace_editor.admin.css');
//
//    return $form;

    return $settings;
  }

  /**
   * {@inheritdoc}
   */
  public function getLibraries(Editor $editor) {
    $libraries[] = 'ace_editor/ace_editor.admin';

    return $libraries;
  }

}
