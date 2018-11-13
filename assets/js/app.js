let a = 'Hello !'
console.log(a);

const button = document.getElementById('button');

if (button) {
  button.addEventListener('click', function() {
    import('jquery').then(($) => {
      var $ = $.default

      $('body').css('background', '#000');
    })
  });
}
