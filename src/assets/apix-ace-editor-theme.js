ace.define("ace/theme/apix",["require","exports","module","ace/lib/dom"], function(acequire, exports, module) {

    exports.isDark = false;
    exports.cssClass = "ace-apix";
    exports.cssText = ".ace-apix .ace_gutter {\
background: #f6f6f6;\
color: #4D4D4C\
}\
.ace-apix .ace_print-margin {\
width: 1px;\
background: #ffffff\
}\
.ace-apix {\
background-color: #f8f8f8;\
color: #4D4D4C\
}\
.ace-apix .ace_cursor {\
color: #AEAFAD\
}\
.ace-apix .ace_marker-layer .ace_selection {\
background: #D6D6D6\
}\
.ace-apix.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px #FFFFFF;\
}\
.ace-apix .ace_marker-layer .ace_step {\
background: rgb(255, 255, 0)\
}\
.ace-apix .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid #D1D1D1\
}\
.ace-apix .ace_marker-layer .ace_active-line {\
background: #EFEFEF\
}\
.ace-apix .ace_gutter-active-line {\
background-color : #dcdcdc\
}\
.ace-apix .ace_marker-layer .ace_selected-word {\
border: 1px solid #D6D6D6\
}\
.ace-apix .ace_invisible {\
color: #D1D1D1\
}\
.ace-apix .ace_keyword,\
.ace-apix .ace_meta,\
.ace-apix .ace_storage,\
.ace-apix .ace_storage.ace_type,\
.ace-apix .ace_support.ace_type {\
color: #8959A8\
}\
.ace-apix .ace_keyword.ace_operator {\
color: #3E999F\
}\
.ace-apix .ace_constant.ace_character,\
.ace-apix .ace_constant.ace_language,\
.ace-apix .ace_constant.ace_numeric,\
.ace-apix .ace_keyword.ace_other.ace_unit,\
.ace-apix .ace_support.ace_constant,\
.ace-apix .ace_variable.ace_parameter {\
color: #F5871F\
}\
.ace-apix .ace_constant.ace_other {\
color: #666969\
}\
.ace-apix .ace_invalid {\
color: #FFFFFF;\
background-color: #C82829\
}\
.ace-apix .ace_invalid.ace_deprecated {\
color: #FFFFFF;\
background-color: #8959A8\
}\
.ace-apix .ace_fold {\
background-color: #4271AE;\
border-color: #4D4D4C\
}\
.ace-apix .ace_entity.ace_name.ace_function,\
.ace-apix .ace_support.ace_function,\
.ace-apix .ace_variable {\
color: #4271AE\
}\
.ace-apix .ace_support.ace_class,\
.ace-apix .ace_support.ace_type {\
color: #C99E00\
}\
.ace-apix .ace_heading,\
.ace-apix .ace_markup.ace_heading,\
.ace-apix .ace_string {\
color: #718C00\
}\
.ace-apix .ace_entity.ace_name.ace_tag,\
.ace-apix .ace_entity.ace_other.ace_attribute-name,\
.ace-apix .ace_meta.ace_tag,\
.ace-apix .ace_string.ace_regexp,\
.ace-apix .ace_variable {\
color: #C82829\
}\
.ace-apix .ace_comment {\
color: #8E908C\
}\
.ace-apix .ace_indent-guide {\
background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bdu3f/BwAlfgctduB85QAAAABJRU5ErkJggg==) right repeat-y\
}";

    var dom = acequire("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});
