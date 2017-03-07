describe('angular-download-attribute', function () {
  'use strict';

  const DATA_HREF = 'data:text/plain;charset=UTF-8,hello world';

  var $window;

  function noop() {
  }

  beforeEach(module('ngDownloadAttribute'));

  beforeEach(inject(function (_$window_) {
    var createElement = _$window_.document.createElement;
    $window = _$window_;
    $window.navigator.msSaveOrOpenBlob = $window.navigator.msSaveOrOpenBlob || noop;
    spyOn($window.navigator, 'msSaveOrOpenBlob');
    spyOn($window.document, 'createElement');
    $window.document.createElement.origin = createElement;
  }));

  describe('not an "a" element', function () {
    var $element;

    beforeEach(inject(function ($compile, $rootScope) {
      $window.document.createElement.and.callFake(function () {
        var element = $window.document.createElement.origin.apply($window.document, arguments);
        if (element.nodeName === 'A' && !('download' in element)) {
          element.download = undefined;
        }
        return element;
      });
      $element = $compile('<div download></div>')($rootScope);
      $rootScope.$digest();
      $element.triggerHandler('click');
    }));

    it('should not use fallback', function () {
      expect($window.navigator.msSaveOrOpenBlob).not.toHaveBeenCalled();
    });

    it('should not have target', function () {
      expect($element.attr('target')).not.toBeDefined();
    });
  });

  describe('supported download attribute', function () {
    var $element;

    beforeEach(inject(function ($compile, $rootScope) {
      $window.document.createElement.and.callFake(function () {
        var element = $window.document.createElement.origin.apply($window.document, arguments);
        if (element.nodeName === 'A' && !('download' in element)) {
          element.download = undefined;
        }
        return element;
      });
      $element = $compile('<a href="' + DATA_HREF + '" download="file-name.ics"></a>')($rootScope);
      $rootScope.$digest();
      $element.triggerHandler('click');
    }));

    it('should not use fallback', function () {
      expect($window.navigator.msSaveOrOpenBlob).not.toHaveBeenCalled();
    });

    it('should not have target', function () {
      expect($element.attr('target')).not.toBeDefined();
    });
  });

  describe('not embedded content', function () {
    var $element;

    beforeEach(inject(function ($compile, $rootScope) {
      $window.document.createElement.and.callFake(function () {
        var element = $window.document.createElement.origin.apply($window.document, arguments);
        if (element.nodeName === 'A' && 'download' in element) {
          return {};
        }
        return element;
      });
      $element = $compile('<a href="https://example.com/any/calendar.ics" download="file-name.ics"></a>')($rootScope);
      $rootScope.$digest();
      $element.triggerHandler('click');
    }));

    it('should not use fallback', function () {
      expect($window.navigator.msSaveOrOpenBlob).not.toHaveBeenCalled();
    });

    it('should have target', function () {
      expect($element.attr('target')).toEqual('_blank');
    });
  });

  describe('not support fallback', function () {
    var $element;

    beforeEach(inject(function ($compile, $rootScope) {
      delete $window.navigator.msSaveOrOpenBlob;
      $window.document.createElement.and.callFake(function () {
        var element = $window.document.createElement.origin.apply($window.document, arguments);
        if (element.nodeName === 'A' && 'download' in element) {
          return {};
        }
        return element;
      });
      $element = $compile('<a href="' + DATA_HREF + '" download="file-name.ics"></a>')($rootScope);
      $rootScope.$digest();
      $element.triggerHandler('click');
    }));

    it('should not use fallback', function () {
      expect($window.navigator.msSaveOrOpenBlob).not.toBeDefined();
    });

    it('should have target', function () {
      expect($element.attr('target')).toEqual('_blank');
    });
  });

  describe('fallback', function () {
    var $element;

    beforeEach(inject(function ($compile, $rootScope) {
      $window.document.createElement.and.callFake(function () {
        var element = $window.document.createElement.origin.apply($window.document, arguments);
        if (element.nodeName === 'A' && 'download' in element) {
          return {};
        }
        return element;
      });
      $element = $compile('<a href="' + DATA_HREF + '" download="file-name.ics"></a>')($rootScope);
      $rootScope.$digest();
      $element.triggerHandler('click');
    }));

    it('should use fallback', function () {
      expect($window.navigator.msSaveOrOpenBlob).toHaveBeenCalled();
    });

    it('should not have target', function () {
      expect($element.attr('target')).not.toBeDefined();
    });
  });
});