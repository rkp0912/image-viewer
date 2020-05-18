import React, { Component } from 'react';
import './Home.css';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CardActions from '@material-ui/core/CardActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import ReactDOM from 'react-dom';
import Login from '../login/Login';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
            searchString:    "",
            comment:"",
            profileData: {
                data: {
                    id: "",
                    username: "",
                    profile_picture: "",
                    full_name: "",
                    bio: "",
                    website: "",
                    is_business: false,
                    counts: {
                        media: 0,
                        follows: 0,
                        followed_by: 0
                    }
                },
                meta: {
                    code: 0
                }
            },
            pageData:[{
                id:"",
                user:{
                   id:"",
                   full_name:"",
                   profile_picture:"",
                   username:""
                },
                images:{
                   thumbnail:{
                      width:150,
                      height:150,
                      url:""
                   },
                   low_resolution:{
                      width:0,
                      height:0,
                      url:""
                   },
                   standard_resolution:{
                      width:0,
                      height:0,
                      url:""
                   }
                },
                created_time:"",
                caption:{
                   id:"",
                   text:"",
                   created_time:"",
                   from:{
                      id:"",
                      full_name:"",
                      profile_picture:"",
                      username:""
                   }
                },
                user_has_liked:false,
                likes:{
                   count:0
                },
                tags:[],
                filter:"",
                comments:{
                   count:0
                },
                type:"",
                link:"",
                location:{
                   latitude:0,
                   longitude:0,
                   name:"",
                   id:0
                },
                attribution:null,
                users_in_photo:[],
                user_comments:"",
                user_commented:false,
             }]
        }
    }

    inputSearchStringChangeHandler = (e) => {
        this.setState({ searchString: e.target.value });
        console.log(this.state.searchString);
        //this.getPageData();
        //if(this.state.searchString === "")
        {
            let dataList = [];
            for(let item of this.state.pageData){
                let post = item;
                console.log(post.show);
                console.log(post.caption.text.split("\n")[0].toLowerCase());
                console.log(post.caption.text.split("\n")[0].toLowerCase().includes(this.state.searchString.toLowerCase()))
                // if(!post.caption.text.split("\n")[0].toLowerCase().includes(this.state.searchString.toLowerCase())){
                //     post.filter = "";
                // }
                post.filter="Normal";
                dataList.push(post);
            }
            this.setState({pageData:dataList})
        }
        if(this.state.searchString !== "")
        {
            let dataList = [];
            for(let item of this.state.pageData){
                let post = item;
                console.log(post.show);
                console.log(post.caption.text.split("\n")[0].toLowerCase());
                console.log(post.caption.text.split("\n")[0].toLowerCase().includes(this.state.searchString.toLowerCase()))
                if(post.caption.text.split("\n")[0].toLowerCase().includes(this.state.searchString.toLowerCase()) === false){
                    post.filter = "";
                }
                dataList.push(post);
            }
        }


        console.log(this.state.pageData);
    }


    getPageData(){
        let that = this;
        let data = null;
        let xhrMovie = new XMLHttpRequest();
        xhrMovie.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    pageData: JSON.parse(this.responseText).data,
                });
            }
        });

        xhrMovie.open("GET", "https://api.instagram.com/v1/users/self/media/recent?access_token="+sessionStorage.getItem("access-token"));
        xhrMovie.setRequestHeader("Cache-Control", "no-cache");
        xhrMovie.send(data);
    }


    componentWillMount() {
        let that = this;
        let data = null;
        let xhrMovie = new XMLHttpRequest();
        xhrMovie.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({
                    profileData: JSON.parse(this.responseText)
                });

                that.getPageData();
            }
        });

        xhrMovie.open("GET", "https://api.instagram.com/v1/users/self/?access_token="+sessionStorage.getItem("access-token"));
        xhrMovie.setRequestHeader("Cache-Control", "no-cache");
        xhrMovie.send(data);
    }


    likePost(data){
        let dataList = [];
        for(let item of this.state.pageData){
            let post = item;
            if(item.id === data.id){
                data.user_has_liked === true ? post.user_has_liked = false : post.user_has_liked = true;
                post.user_has_liked === false ? post.likes.count = post.likes.count -1 : post.likes.count = post.likes.count + 1;
            }
            dataList.push(post);
        }
        this.setState({pageData:dataList})
    }


    commentTextChangeHandler = (e) => {
        this.setState({ comment: e.target.value });
    }


    AddCommentClickHandler(data, inputControl){
        if(this.state.comment === "")
            return;

        let dataList = [];
        for(let item of this.state.pageData){
            let post = item;
            if(item.id === data.id){
                post.user_comments = this.state.comment;
                post.user_commented = true;
            }
            dataList.push(post);
        }
        this.setState({pageData:dataList});
        this.setState({comment:""})
        console.log(this.state.comment);
    }

    logout(){
        sessionStorage.clear();
        console.log(sessionStorage.getItem("access-token"))
        ReactDOM.render(<Login/>, document.getElementById('root'));
    }


    render(){        
        const { classes } = this.props;
        return(
            <div>
                <header className="app-header-home">
                    <label className="app-text">Image viewer</label>
                    <div className="app-sub-header">
                        <div className="search-div">
                            <div className="search-icon">
                                <SearchIcon />
                            </div>
                            <InputBase
                            placeholder="Search..." searchbar={this.state.searchString} onChange={this.inputSearchStringChangeHandler}
                            // classes={{
                            //     root: classes.inputRoot,
                            //     input: classes.inputInput,
                            // }}
                            // inputProps={{ 'aria-label': 'search' }}
                            />
                        </div>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                            {(popupState) => (
                                <React.Fragment>
                                    <IconButton color="primary" className="profile-picture" {...bindTrigger(popupState)}>
                                        <img src={this.state.profileData.data.profile_picture} className="profile_img" alt={this.state.profileData.data.username}/>
                                    </IconButton>
                                    <Menu {...bindMenu(popupState)} className="menu-container">
                                        <MenuItem onClick={popupState.close} divider>My Account</MenuItem>
                                        <MenuItem onClick={this.logout}>Logout</MenuItem>
                                    </Menu>
                                </React.Fragment>
                            )}
                        </PopupState>
                    </div>
                </header>
                <GridList cellHeight={500} cols={2}>
                {/* <div className="cards-div"> */}
                    {this.state.pageData.map(data => (
                        <GridListTile className="grid-item" key={"grid" + data.id} style={{ height: 'auto' }}>
                            {/* {
                                console.log(parseInt(data.caption.created_time))
                            } */}
                            {/* <img src={data.images.standard_resolution.url} className="movie-poster" alt="test" />
                            <GridListTileBar
                                title={data.caption.id}
                                subtitle={<span>Release Date: {new Date(data.created_time).toDateString()}</span>}
                            /> */}
                            <Card className="postsCard" style={{display: data.filter === "Normal" ? 'block' : 'none' }}>
                                <CardHeader
                                    avatar={
                                        <Avatar aria-label="recipe">
                                            <img src={data.caption.from.profile_picture} className="posted-by" alt="test" />
                                        </Avatar>
                                        }
                                     title={data.caption.from.username} 
                                     subheader={<span>{new Date(Number(data.created_time)).toDateString()}</span>}
                                />
                                <CardMedia>
                                    <img src={data.images.low_resolution.url} className="movie-poster" alt="test" />
                                    <hr className="horizontal-rule-style"/>
                                </CardMedia>
                                <CardContent>
                                    <div>
                                        {data.caption.text.split("\n")[0]}
                                    </div>
                                    <div className="hashTags">
                                        {data.tags.map(tag =>(
                                            <span key={data.id+tag}>#{tag} </span>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardActions>
                                    <IconButton onClick={() => this.likePost(data)}>
                                        {
                                            data.user_has_liked === true
                                            ?<FavoriteIcon className="fav-icon-color"/>
                                            :<FavoriteBorderIcon/>
                                        }
                                    </IconButton>
                                    <span/>
                                    <span/> 
                                    <span>{data.likes.count} Likes</span>
                                </CardActions>
                                <div className="comments-show" style={{display: data.user_commented ? 'block' : 'none' }}>
                                    <span className="comment-username">{data.user.username}:</span>
                                    <span> {data.user_comments}</span>
                                </div>
                                <div className="comment-section">
                                    <FormControl>
                                        <InputLabel htmlFor={"inputComment"+data.id}>Add a comment</InputLabel>
                                        <Input id={"inputComment"+data.id} type="text" inputcomment={this.state.comment} onChange={this.commentTextChangeHandler}/>
                                    </FormControl>
                                    <Button variant="contained" color="primary" onClick={() => this.AddCommentClickHandler(data)}>ADD</Button>
                                </div>
                            </Card>
                        </GridListTile>
                    ))}
                {/* </div> */}
                </GridList>
            </div>
        )
    }
}
export default Home;