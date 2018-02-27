let sendReq = () => {
//  let result = []
  let queryVal = $('.search-wrap__field').val().toLowerCase()
  let startTime = new Date().getTime()

  $.get('/' + queryVal).done(function (data) {
    $('.results-wrap').empty()
    let dataObj = JSON.parse(data)
    let dataObjArr = dataObj[queryVal]
    if (dataObjArr) {
      let resStr = 'result'
      if (dataObjArr.length > 1) {
        resStr += 's'
      }
      $('.results-wrap').append('<p class="time">' + dataObjArr.length + ' ' + resStr + ', <span class=".results-wrap__time"></span></p><hr>')
      for (let i = 0; i < dataObjArr.length; i++) {
        $('.results-wrap').append('<p class="results-wrap__single"><i class="fa fa-angle-right" aria-hidden="true"></i><a href="' + dataObjArr[i] + '">' + dataObjArr[i] + '</a></p>')
      }
    } else {
      $('.results-wrap').append('<p class="results-wrap__empty">No results found for: "' + queryVal + '"...</p>')
    }
    let requestTime = new Date().getTime() - startTime
    $('.time').append('<span class="nesto">' + (requestTime / 1000).toFixed(2) + ' seconds to complete request </span>')
  })
}

$('.search-wrap__btn').on('click', function (e) {
  sendReq()
})

$('.search-wrap__field').on('keyup', function (e) {
  if (e.which === 13) {
    sendReq()
  } else if (e.which === 8) {
    $('.results-wrap').empty()
  }
})
