const likeButton = document.getElementById('like-button');
const commentButton = document.getElementById('comment-button');

if(likeButton){
    likeButton.addEventListener('click', async function(ev){  
        console.log(ev);
    });
}

if(commentButton){
    commentButton.addEventListener('click', async function(ev){
        try{
            const text = document.getElementById('comment-box').value;  
            if(!text) return;
            const postId = commentButton.dataset.postId;
            var resp = await fetch('/comments/create', {
                method:"POST",
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text,
                    postId
                }),
            });
            var data = await resp.json();
            console.log(data);
        }
        catch(err){
            console.error(err);
        }
    });
}