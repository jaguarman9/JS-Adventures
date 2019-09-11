var $in = $('#in');
var $out = $('#out');
var $submit = $('#go');
var $text = '';

function backwards() {
    $text = $in.val();
        for(let i=$text.length-1, temp='';i>=0;i--){
            temp += $text[i];
            $out.val(temp);
        }   
}