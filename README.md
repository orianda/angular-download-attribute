# Angular download attribute

AngularJS (v1) polyfill about the HTML5 download attribute for anchor elements.

Covers the native HTML5 download attribute and supports download in case it is not supported in the browser natively. 

This polyfill was especially made for Internet Explorer 10 and 11.
 
## Usage
 
```
<a href="/link/to/file.txt" download="description.txt">Download the text file</a>
```

```
<a href="data:text/plain;charset=UTF-8,hello world" download="greetings.txt">Download me</a>
```

In case the download attribute is supported natively, then this polyfill will not have any effect.

If the href attribute links to a file or the polyfill is not supported, at least the target attribute will be set to "_blank".

Otherwise, the download will be triggered via JavaScript.

