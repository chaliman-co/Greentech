<!DOCTYPE html>
<html>
<head>
        @vite('resources/css/app.css')
        @vite('resources/css/toast.css')
</head>
<body>
  <div id="loader" class="not-loaded"></div>
    <div>
      <div id="toast">
        <div class="toast-content">
          <div class="toast-img-box"><img src="/img/check.png"></div>
          <div class="toast-message">A notification message..</div>
        </div>
        <div class="toast-progress"></div>
      </div>
    </div>
    <div id="loader">
    </div>
  <div id="app"></div>
  @vite('resources/js/app.js')
</body>
</html>