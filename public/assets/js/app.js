/* ************* The Rating Widget ************************** */
/**************************************************************/

var ratingWidget = function(ratingList, toggle)
{
	var that = this;
	if(arguments.length==2)
		this.starCount = toggle;
	else
		this.starCount=0;
	this.ratingList = ratingList;

	$.each(this.ratingList.find('.tara'), function(i, star){
		//console.log(this);
		$(star).attr('id', 'rating_'+i).css('cursor', 'pointer');
		$(star).on('mouseover', function(){ return that.rateOver( i ) });
		$(star).click(function(){ return that.rateClick( i ) });
	});
	this.ratingList.on('mouseout', $.proxy(this.rateOut, this));
}
// ratingWidget.prototype.rateClick=function(i)
// {
// 	var that = this;
// 	var request = $.ajax({
// 		type:"POST",
// 		data:{ rating: i+1 },
// 		url:'action/rating'
// 	})
// 	.done(function(data)
// 	{	
// 		that.postClick(i);
// 	})
// 	.fail(function(data, textStatus, errorThrown){
// 		console.log(errorThrown);
// 		console.log('what');

// 	});
// }
ratingWidget.prototype.rateOver=function(i)
{
	for(var j=0; j<5; j++)
	{
		if(j<=i)
			$("#rating_"+j).removeClass('fa-star-o').addClass('fa-star');
		else
			$("#rating_"+j).addClass('fa-star-o');
	}
}
ratingWidget.prototype.rateClick=function(i)
{
	var current = i;
	for(var j = 0; j < 5; j++)
	{
		if(j <=i)
		{
			$('#rating_'+j).removeClass('fa-star-o').addClass('fa-star');
			$('#rating_'+j).off();
		}
		$('#rating_'+j).off();
		//this.ratingList.off('mouseout');
	}
	this.ratingList.off('mouseout');
	this.ratingList.attr('data-rating', i+1);
}


ratingWidget.prototype.rateOut=function()
{
	for(var j = 0; j < 5; j++)
	{
		if(j<this.count)
			$("#rating_"+j).removeClass('fa-star-o').addClass('fa-star');
		else
			$("#rating_"+j).removeClass('fa-star').addClass('fa-star-o');
	}
}

/* ************* The End ************************************ */
/**************************************************************/



var BookmarkGo = function()
{
	this.bmBody = $('#bookmarks-body');
	this.bmRows = this.bmBody.children('.row');

	for(var i=0; i<this.bmRows.length; i++)
	{
		this.init(this.bmRows[i]);
	}
}

/* takes individual Rows */
/* Binds functions to edit and delete */
BookmarkGo.prototype.init=function(row)
{
	var that = this;
	var row = $(row);
	this.currentRow = row;

	var editBtn = row.children('.edit');

	//row.children('.delete').on('click', $.proxy(that.bmDelete, row));
	row.children('.delete').on('click', function(){
		return that.bmDelete();
	});
	editBtn.on('click', function(){
		return that.bmEdit();
	});
	
}

/* what a monstrosity */
BookmarkGo.prototype.bmEdit = function()
{
	var that = this;
	var oldElements = this.currentRow.children();
	this.savedElements = oldElements.clone(true);
	console.log(oldElements);
	$.each(oldElements, function(i, val){

		if($(val).hasClass('num'))
		{
			var action = $('<div>').html('<i class="fa fa-cog fa-spin"></i>')
							.addClass('actionIndicator num');
			action.attr('data-num', $(this).text());
			$(this).replaceWith(action);
		}

		else if($(val).is("a"))
		{
			var titleSpan = $(this).children();
			var title = $("<input>").attr({type:"text", 'data-url':$(val).attr('href')}).addClass('title')
				.val(titleSpan.html());
			titleSpan.replaceWith(title);
			title.unwrap();
		}

		else if($(val).hasClass('stars'))
		{
			var list = $(this).children();
			var count = list.data('rating');
			var ratWidg = new ratingWidget(list, count);

		}
		else if($(val).hasClass('edit'))
		{
			var btn = $(this);
			btn.off();
			btn.removeClass('blue').addClass('green')
			.text('Save').click(function(){
				return that.saveEdit();
			});
		}
		else if($(val).hasClass('delete')){
			// var btn = $(this);
			// btn.off();
			// btn.text('cancel').on('click', $.proxy(that.bmDelete, this.currentRow));

			var btn = $(this);
			btn.off();
			btn.text('cancel').on('click', function(){
				return that.cancelEdit();
			});
		
		}
	});

}
BookmarkGo.prototype.cancelEdit=function()
{
	this.currentRow.children().remove();
	this.currentRow.append(this.savedElements);
}

BookmarkGo.prototype.collectValues=function()
{
	/* this will collect values before new post creations or edits */
}

BookmarkGo.prototype.saveEdit = function()
{
	

	this.postEdit();
}
BookmarkGo.prototype.postEdit=function()
{
	var that = this;
	$.each(this.currentRow.children(), function(i, val){
		var val = $(val);
		if(val.hasClass('num'))
		{
			var count = val.data('num');
			var numSpan = $('<span>').attr('data-num', count)
				.addClass('num').text(count);
			val.replaceWith(numSpan);
		}

		else if(val.hasClass('title'))
		{
			var titleSpan = $('<span>').addClass('title').text(val.val());
			var link = $('<a>').attr({ href: val.data('url'), target:"_blank"});
			link.append(titleSpan);
			console.log(link);
			val.replaceWith(link);
		}

		else if(val.hasClass('stars'))
		{
			var ratingList = val.children();
			ratingList.children('tara').off();;

		}

		else if(val.hasClass('edit'))
		{
			val.off();
			val.removeClass('green').addClass('blue')
				.text('Edit').click(function(){
					return that.bmEdit();
				});
		}
		else if(val.hasClass('delete'))
		{
			val.off();
			var icon = $('<i class="fa fa-times fa-lg">');
			val.text('').append(icon).click(function(){
				return that.bmDelete();
			});
		}

	});
	
}

BookmarkGo.prototype.bmDelete=function()
{
	this.currentRow.remove();
}




$(document).ready(function(){
	var bm = new BookmarkGo();

	//var check = new ratingWidget('ratingList');
})