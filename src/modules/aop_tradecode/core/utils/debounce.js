const debounce = function(fn, delay = 200){
    var timer
    return function (){
        var args = arguments
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            timer = null
            fn.apply(this, args)
        }, delay)
    }
}

export default debounce