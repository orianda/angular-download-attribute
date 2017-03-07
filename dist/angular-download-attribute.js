/*!
 * angular-download-attribute
 * AngularJS (v1) polyfill about the HTML5 download attribute for anchor elements.
 *
 * @version v1.0.0
 * @link https://github.com/orianda/angular-download-attribute
 * @author Orianda <orianda@paan.de>
 * @license MIT
 */
angular.module('ngDownloadAttribute', []).directive('download', [
  '$window',
  function ($window) {
    'use strict';

    return {
      restrict: 'A',
      scope: false,
      link: function ($scope, $element, $attrs) {
        var data = $attrs.href;
        var name = $attrs.download;
        var blob;

        /**
         * Leave, if element is not a link element
         */
        if ($element[0].nodeName !== 'A') {
          return;
        }

        /**
         * Leave, if the download attribute is supported natively
         */
        if ('download' in $window.document.createElement('a')) {
          return;
        }

        /**
         * Add blank target if resource is not an embedded one
         */
        if (!(/^data:/i).test(data)) {
          $element.attr('target', '_blank');
          return;
        }

        /**
         * Add blank target if fallback is not supported
         */
        if (!$window.navigator.msSaveOrOpenBlob) {
          $element.attr('target', '_blank');
          return;
        }

        data = data.split(',').slice(1).join(',');
        data = decodeURIComponent(data);
        blob = new Blob([data]);

        /**
         * Trigger download, when element is clicked
         */
        $element.on('click', function (event) {
          event.preventDefault();
          $window.navigator.msSaveOrOpenBlob(blob, name);
        });
      }
    };
  }
]);

