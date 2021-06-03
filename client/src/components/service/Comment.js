function Comment({ content }) {
  //   const [comment, setComment] = useState("");

  /**
   *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
   *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */

  var disqus_config = function () {
    this.page.url = window.location.href; // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = { content }; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
  };

  (function () {
    // DON'T EDIT BELOW THIS LINE
    var d = document,
      s = d.createElement("script");
    s.src = "https://cinemaonline-1.disqus.com/embed.js";
    s.setAttribute("data-timestamp", +new Date());
    (d.head || d.body).appendChild(s);
  })();

  return (
    <div className="comment-container">
      <div id="disqus_thread"></div>
      <noscript>
        Please enable JavaScript to view the{" "}
        <a href="https://disqus.com/?ref_noscript">
          comments powered by Disqus.
        </a>
      </noscript>
    </div>
    // <div className="comment-container">
    //   <div></div>
    //   <form>
    //     <h2 className="comment-title">Leave Comment</h2>
    //     <textarea
    //       className="comment-input"
    //       type="text"
    //       required
    //       placeholder="Comment"
    //       value={comment}
    //       onChange={(e) => setComment(e.target.value)}
    //     ></textarea>
    //     <button className="comment-btn">Post Comment</button>
    //   </form>
    // </div>
  );
}

export default Comment;
