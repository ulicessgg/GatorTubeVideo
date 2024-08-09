const likeButton = document.getElementById('like-button');
const commentButton = document.getElementById('comment-button');

function addCommentToScreen(data, container){
    let commentFragment = document.createElement('template');
    commentFragment.innerHTML = 
        `<div class="comment">
            <h4 class="comment-author">${data.username}</h4>
            <h4 class="comment-date">${(new Date()).toLocaleString("en-us", 
                { dateStyle: "long", timeStyle: "medium"})}</h4>
            <p class="comment-text">${data.text}</p>
         </div>`;
    container.prepend(commentFragment.content.firstChild);
}

if(likeButton){
    likeButton.addEventListener('click', async function(ev){  
        try{
            const postId = ev.currentTarget.dataset.postid;
            var resp = await fetch(`/posts/like/${postId}`, {method: "POST"});
            var data = await resp.json();
            console.log();
        }
        catch(err){
            console.error(err);
        }
    });
}

if(commentButton){
    commentButton.addEventListener('click', async function(ev){
        try{
            const text = document.getElementById('comment-box');  
            if(!text.value) return;
            const postid = commentButton.dataset.postid;

            console.log('postId:', postid);

            var resp = await fetch('/comments/create', {
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: text.value,
                    postid
                }),
            });
            const commentsBox = document.getElementById('comments');
            var data = await resp.json();
            if(data.status == "success"){
                addCommentToScreen(data, commentsBox);
                text.value = "";
            }
        }
        catch(err){
            console.error(err);
        }
    });
}