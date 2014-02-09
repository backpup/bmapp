/* ************* The Rating Widget ************************** */
/**************************************************************/

var ratingWidget = function(ratingList)
{
	var that = this;
	
	this.ratingList = $("."+ratingList);
	this.choiceOn = $('<i class="fa fa-star fa-lg"></i>');
	this.choiceOff = $('<i class="fa fa-star-o fa-lg"></i>');
	$.each(this.ratingList.find('.fa-lg'), function(i, star){
		//console.log(this);
		$(star).attr('id', 'rating_'+i).css('cursor', 'pointer');
		$(star).on('mouseover', function(){ return that.rateOver( i ) });
		$(star).click(function(){ return that.rateClick( i ) });
	});
	this.ratingList.on('mouseout', $.proxy(this.rateOut, this));
}
ratingWidget.prototype.rateClick=function(i)
{
	var that = this;
	var request = $.ajax({
		type:"POST",
		data:{ rating: i+1 },
		url:'action/rating'
	})
	.done(function(data)
	{	
		that.postClick(i);
	})
	.fail(function(data, textStatus, errorThrown){
		console.log(errorThrown);
		console.log('what');

	});
}
ratingWidget.prototype.rateOver=function(i)
{
	var current = i;
	for(var j = 0; j <= i; j++)
	{
		$('#rating_'+j).removeClass('fa-star-o').addClass('fa-star');
	
	}
}

ratingWidget.prototype.postClick=function(i)
{
	for(var j = 0; j < 5; j++)
	{
		if(j < i)
			$('#rating_'+j).removeClass('fa-star-o').addClass('fa-star');
		$('#rating_'+j).css('cursor', 'default');
		$('#rating_'+j).off();
	}

	this.ratingList.off('mouseout');
}

ratingWidget.prototype.rateOut=function()
{
	for(var j = 0; j < 5; j++)
	{
		var star=$("#rating_"+j);

		if(star.hasClass('fa-star'))
		{
			star.removeClass('fa-star').addClass('fa-star-o');
		}else{
			break;
		}

	}
}

/* ************* The End ************************************ */
/**************************************************************/




$(document).ready(function(){
	var check = new ratingWidget('ratingList');
})