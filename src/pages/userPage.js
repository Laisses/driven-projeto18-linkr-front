import { BASE_URL, BASE_URL_LOCAL } from "../constants/url";
import styled from "styled-components";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { IoPaperPlaneOutline } from "react-icons/io5"
import { AiOutlineComment } from 'react-icons/ai'
import { TiPencil, TiTrash } from "react-icons/ti";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../contexts/MyContext";
import TrendingList from "../components/trending";
import Header from "../constants/header";
import axios from "axios";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { ReactTagify } from "react-tagify"
import { useNavigate, useParams } from "react-router-dom";
import DeleteReactModal from "react-modal";
import ShareReactModal from "react-modal";
import { device } from "../constants/device"
import { Link } from "react-router-dom";
import { BiRepost } from "react-icons/bi";


export const UserPage = () => {
    const { config, counter, setCounter, data, token, followingIds } = useContext(MyContext);
    const [posts, setPosts] = useState([]);
    const [errorMessage, setErrorMessage] = useState(false);
    const navigate = useNavigate();
    const [clickedPosts, setClickedPosts] = useState([]);
    const { userId } = useParams()
    const [userName, setUserName] = useState("")
    const [userPhoto, setUserPhoto] = useState("https://img.freepik.com/free-icon/user_318-804790.jpg?w=2000")
    const [enableButton, setEnableButton] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteModalPostId, setDeleteModalPostId] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareModalPostId, setShareModalPostId] = useState(null);
    
    useEffect(() => {
        if (token === null) {
            alert("You must be logged in to access this page");
            navigate("/")
        }
    })

    useEffect(() => {
        axios.get(`${BASE_URL}/userData/${userId}`, config)
        .then((res) => {
            setUserName(res.data.name)
            setUserPhoto(res.data.photo)
        })
    })
    
    const deletePostHandler = async (postId) => {
        try {
            await axios.delete(`${BASE_URL_LOCAL}/timeline/${postId}`, config);
            setIsDeleteModalOpen(false);
            setDeleteModalPostId(null)
            getPosts();
        } catch (error) {
            setErrorMessage(true);
        }
    }
    
    const getPosts = async () => {
        if (token === null) return "You must be logged in to access this page"
        
        try {
            const res = await axios.get(`${BASE_URL}/user/${userId}`, config);
            setPosts(res.data);
        } catch (error) {
            setErrorMessage(true);
            alert("You must login to access this page");
            navigate("/");
        }
    };

    const postRepost = async (postId) => {
        const request = axios.post(`${BASE_URL_LOCAL}/reposts`, {id: postId}, config);
        request.then(()=> {
            setIsShareModalOpen(false);
            setShareModalPostId(null)
            getPosts();
        });
        request.catch ((err) => {
            alert("Algo deu errado e a culpa é nossa. =/");
            console.log(err);
    });
}

    const openNewTab = url => {
        window.open(url, '_blank').focus();
    };

    useEffect(() => {
        getPosts();
    }, [setErrorMessage, counter]);    

    const likeHandler = (postId) => {
        const request = axios.post(`${BASE_URL}/likes`, {id: postId}, config);
            request.then((res) => {
                getPosts();
            });
        request.catch((err) => {
            console.log(err);
        });
    }

    const addHashtag = async (name, post_id) => {
        try {
            await axios.post(`${BASE_URL}/hashtag`, { name, post_id }, config);
            setCounter(counter + 1)
        } catch (err) {
            console.log(err);
        }
    }

    const editHashtag = async (post_id, text) => {
        try {
            await axios.delete(`${BASE_URL}/hashtag/${post_id}`, config);
            setCounter(counter + 1)
        } catch (err) {
            console.log(err);
        }

        const descriptionWords = text.split(" ")

        descriptionWords.forEach((w) => {
            if (w.includes("#")) {
                addHashtag(w.replace("#", ""), post_id)
            }
        });
    }

    const showComment = (id) => {
        if (!clickedPosts.includes(id)) {
            let newArray = [...clickedPosts, id]
            setClickedPosts(newArray)
        }

        if (clickedPosts.includes(id)) {
            let newArray = clickedPosts.filter(postId => postId !== id)
            setClickedPosts(newArray)
        }
    }

    const postComment = async (comment, postId, userId) => {
        try {
            await axios.post(`${BASE_URL}/comments`, {comment, postId, userId}, config);
            getPosts()
        } catch (error) {
            console.log(error)
        }
    }

    const submitNewDesc = async (id, text, onErrorFn) => {
        try {
            await axios.put(`${BASE_URL}/timeline`, {post_id: id, description: text}, config);
            getPosts();
        } catch (err) {
            alert("Sorry! Something went wrong, please try again later!")
            onErrorFn();
        }
    };

    const ListofPosts = post => {
        const { id, description, link, user: u, likes, comments, reposts, repostedBy, isRepost } = post;
        const [editing, setEditing] = useState(false);
        const [edit, setEdit] = useState(false);
        const [text, setText] = useState(description);
        const [comment, setComment] = useState("");
              
        const tooltipLikesInfo = (likes) => {
            const result = likes.map((like) => {
                return (
                <TooltipLike key={like.user_id}>
                    <TooltipImg src={like.user_photo}/>
                    <TooltipName>{like.user_name}</TooltipName>
                </TooltipLike>)
            }, [])
            return <TooltipContainer>{result}</TooltipContainer>
        }

        //Estilo da hashtag
        const tagStyle = {
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer'
        };

        //Ordenando comentários pela data de criação
        comments.sort(function (x, y) {
            let a = new Date(x.time),
                b = new Date(y.time);
            
            return a - b
        })

        return (
            <PostBackground>
                {isRepost 
                  ? 
                  <RepostContainer>
                      <BiRepost size={"20px"} color="white"/>
                      <RepostText>Re-posted by {repostedBy}</RepostText>
                  </RepostContainer>
                  :
                  <></>
                }
                
                <PostsContainer>
                    <LeftPart>
                        <ProfilePicture
                            src={u.photo}
                            alt="profile picture"
                        />

                        <LikeIcon id={`anchor-element${id}`}  event={ isRepost ? "none" : "all"} onClick={()=>{
                            getPosts()
                            likeHandler(id)
                        }}>
                            {likes.filter(like => like.user_id === data.user.id).length ? <IoIosHeart color="red" size={"30px"} /> : <IoIosHeartEmpty size={"30px"} />}
                            <LikeText>{`${likes.length} likes`}</LikeText>
                        </LikeIcon>
                        <Tooltip anchorId={`anchor-element${id}`} place="bottom">{tooltipLikesInfo(likes)}</Tooltip>


                        <CommentIcon>
                            <AiOutlineComment onClick={() => showComment(id)}/>
                            <CommentText>{`${comments.length} comments`}</CommentText>
                        </CommentIcon>
                        
                        <ShareIcon event={ isRepost ? "none" : "all"}  id={`anchor-share-element${id}`} onClick={()=>{
                            openShareModal(id)
                            }}>
                            <BiRepost size={"20px"} />
                            <ShareText>{`${reposts.length} re-posts`}</ShareText>
                        </ShareIcon>
                        <Tooltip anchorId={`anchor-share-element${id}`} place="bottom">Hello Shares</Tooltip>
                    </LeftPart>

                    <Post event={ isRepost ? "none" : "all"}>
                        <PostHeader>
                            <StyledLink to={`/user/${u.id}`}><Username>{u.name}</Username></StyledLink>
                            {
                                data.user.id === u.id
                                    ?
                                    <HeaderIcons>
                                    <div>
                                        <EditIcon onClick={() => {
                                            setEdit(!edit);
                                            setText(description);
                                        }}>
                                            <TiPencil size={"20px"} />
                                        </EditIcon>
                                    </div>
                                    <div>
                                        <DeleteIcon onClick={() => {
                                            openDeleteModal(id)
                                        }}>
                                            <TiTrash size={"20px"} />
                                        </DeleteIcon>
                                    </div>
                                    </HeaderIcons>
                                    :
                                    <></>
                            }
                        </PostHeader>
                        
                        {
                            !edit
                                ?
                                <ReactTagify
                                    tagStyle={tagStyle}
                                    tagClicked={(tag) => {
                                        navigate(`/hashtag/${tag.replace('#', '')}`)
                                    }}
                                >
                                    <Description>{description || ""}</Description>
                                </ReactTagify>
                                :
                                <EditInput
                                    id="edit"
                                    name="edit"
                                    value={text}
                                    onChange={e => setText(e.target.value)}
                                    disabled={editing}
                                    autoFocus={true}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            editHashtag(id, text)
                                            setEditing(true);
                                            submitNewDesc(id, text, () => setEditing(false));
                                        } else if (e.key === "Escape") {
                                            setEdit(false);
                                            setText(description);
                                        }
                                    }}
                                />
                        }
                        <LinkContainer>
                            <LinkMetaData onClick={() => openNewTab(link.address)}>
                                <LinkTitle>{link.title}</LinkTitle>
                                <LinkDescription>{link.hint}</LinkDescription>
                                <LinkUrl>{link.address}</LinkUrl>
                            </LinkMetaData>
                            <LinkImage
                                src={link.image}
                                alt="icon of text"
                            />
                        </LinkContainer>
                    </Post>
                </PostsContainer>

                <CommentContainer isOpen={clickedPosts.includes(id)}>
                    {
                        comments.map((c, idx) => 
                                <li key={idx}>
                                    <img src={c.user_photo} alt='user picture'/>

                                    <div>
                                        {
                                            u.id === c.user_id
                                            ?
                                            <h1>{c.user_name} <span>• post’s author</span></h1>
                                            :
                                            <h1>
                                                {
                                                followingIds.includes(c.user_id)
                                                ?
                                                <h1>{c.user_name} <span>• following</span></h1>
                                                :
                                                <h1>{c.user_name}</h1>
                                                }
                                            </h1>
                                        }
                                        <span>{c.comment}</span>
                                    </div>
                                </li>
                           )
                    }
                </CommentContainer>

                <PostCommentContainer isOpen={clickedPosts.includes(id)}>
                    <img src={data.user.photo} alt="user picture"/>
                    <input placeholder="write a comment..." onChange={(e) => {setComment(e.target.value)}}/>
                    <IoPaperPlaneOutline onClick={() => postComment(comment, id, data.user.id)}/>
                </PostCommentContainer>
        </PostBackground>
        );
    };

    const Posts = () => {
        if (!posts) {
            return <Message>Loading...</Message>
        } else if (posts.length === 0) {
            return <Message>There are no posts yet</Message>
        } else if (posts) {
            return (
                <ListContainer>
                    {posts.map(p => <ListofPosts
                        key={p.id}
                        {...p}
                    />)}
                </ListContainer>
            );
        }
    };

    const openDeleteModal = (id) => {
        setIsDeleteModalOpen(true)
        setDeleteModalPostId(id)
    }

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false)
    }

    const openShareModal = (id) => {
        setIsShareModalOpen(true)
        setShareModalPostId(id)
    }

    const closeShareModal = () => {
        setIsShareModalOpen(false)
    }

    function switchFollow() {
        setEnableButton(true)
        
        if (followingIds.includes(Number(userId))) {
            axios.delete(`${BASE_URL}/unfollow/${userId}`, config)
            .then((res) => {
                setEnableButton(false)
                setCounter(counter + 1)
                
            }).catch((err) => {
                setEnableButton(false)
                console.log(err)
                alert("Não foi possível executar a operação")
            })

        } else {
            axios.post(`${BASE_URL}/follow/${userId}`, null, config)
            .then((res) => {
                setEnableButton(false)
                setCounter(counter + 1)

            }).catch((err) => {
                setEnableButton(false)
                console.log(err)
                alert("Não foi possível executar a operação")
            })
        }
    }

    return (
        <>
<Header />
            <DeleteReactModal
                    isOpen={isDeleteModalOpen}
                    contentLabel="Minimal Modal Example"
                    style={{overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                      },
                      content: {
                        position: 'absolute',
                        width: '497px',
                        height: '262px',
                        top: '30%',
                        bottom: '30%',
                        left: '30%',
                        right: '30%',
                        border: '1px solid #333333',
                        background: '#333333',
                        overflow: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        borderRadius: '50px',
                        outline: 'none',
                        padding: '20px',

                      }}}
                >
                    <ModalContainer>
                        <ModalText>Are you sure you want to delete this post?</ModalText>
                        <ModalButtons>
                        <ModalButtonCancel onClick={closeDeleteModal}>Cancelar</ModalButtonCancel>
                        <ModalButtonConrfirm onClick={() => deletePostHandler(deleteModalPostId)}>Confirmar</ModalButtonConrfirm>
                        </ModalButtons>
                    </ModalContainer>
            </DeleteReactModal>
            <ShareReactModal
                    isOpen={isShareModalOpen}
                    contentLabel="Minimal Modal Example"
                    style={{overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.75)',
                      },
                      content: {
                        position: 'absolute',
                        width: '497px',
                        height: '262px',
                        top: '30%',
                        bottom: '30%',
                        left: '30%',
                        right: '30%',
                        border: '1px solid #333333',
                        background: '#333333',
                        overflow: 'auto',
                        WebkitOverflowScrolling: 'touch',
                        borderRadius: '50px',
                        outline: 'none',
                        padding: '20px',

                      }}}
                >
                    <ModalContainer>
                        <ModalText>Are you sure you want to re-post this post?</ModalText>
                        <ModalButtons>
                        <ModalButtonCancel onClick={closeShareModal}>Cancelar</ModalButtonCancel>
                        <ModalButtonConrfirm onClick={() => postRepost(shareModalPostId)}>Confirmar</ModalButtonConrfirm>
                        </ModalButtons>
                    </ModalContainer>
            </ShareReactModal>
            <TimelineBackground>
                <TimelineContainer>
                    <Title><img src={userPhoto} alt="profile pic" /> <span>{userName}'s posts</span></Title>
                    
                    {!errorMessage
                        ? <Posts />
                        : <Message>An error occured while trying to fetch the posts, please refresh the page</Message>
                    }
                </TimelineContainer>

                <FollowContainer>
                    <FollowButton onClick={switchFollow} disabled={enableButton} following={followingIds.includes(Number(userId))}>{followingIds.includes(Number(userId)) ? "Unfollow" : "Follow"}</FollowButton>
                    <TrendingList />

                </FollowContainer>
            </TimelineBackground>
        </>
    );
};

//Styled Components

const FollowButton = styled.button`
    background-color: ${props => props.following ? "#FFFFFF" : "#1877F2"};
    border-radius: 5px;
    border: none;
    height: 31px;
    width: 112px;
    margin-top: 70px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 17px;
    color: ${props => props.following ? "#1877F2" : "#FFFFFF"};
    cursor: pointer;

    &&:hover {
        filter: brightness(80%);
    }
`

const FollowContainer = styled.div`
    height: 58vh;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`

const StyledLink = styled(Link)`
    text-decoration: none;
    color: #FFFFFF;
`

const TimelineBackground = styled.div`
    background-color: #333333;
    display: flex;
    justify-content: center;
`;

const TimelineContainer = styled.div`
    margin-right: 50px;
    padding-top: 70px;
    max-width: 611px;
    min-width: 611px;

    @media ${device.laptop} {
        margin-right: 0;
        min-width: 0;
    }

    @media ${device.tablet} {
        width: 100%;
        min-width: 0;
    }
`;

const Title = styled.h1`
    font-family: 'Oswald', sans-serif;
    font-size: 43px;
    color: #ffffff;
    margin-bottom: 43px;
    display: flex;
    gap: 15px;
    img {
        height: 50px;
        width: 50px;
        border-radius: 100%;
    }
    @media ${device.mobileL} {
        padding-left: 16px;
    }
`;

const Message = styled.p`
    font-family: 'Lato', sans-serif;
    font-size: 20px;
    color: #ffffff;
`;

const ProfilePicture = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`;

const EditInput = styled.textarea`
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: 300;
    border-radius: 3px;
    background-color: #EFEFEF;
    border: none;
    margin-top: 5px;
    padding-top: 5px;
    padding-left: 10px;
    resize: none;
    &:focus {
        outline: none;
    }
`;

const ListContainer = styled.ul`
    display: flex;
    flex-direction: column;
    gap: 35px;
`

const PostBackground = styled.div`
    background-color: #1E1E1E;
    border-radius: 16px;
`;

const PostsContainer = styled.div`
    position: relative;
    width: 611px;
    height: auto;
    padding: 16px;
    border-radius: 16px;
    color: #ffffff;
    background-color: #171717;
    display: flex;

    @media (max-width: 840px) {
        border-radius: 0;
        width: 100%;
    }
`;

const Post = styled.li`
    pointer-events: ${props => props.event};
    font-family: 'Lato', sans-serif;
    font-weight: 400;
    padding-left: 18px;


    @media (max-width: 840px) {
        width: 100%;
    }
`;

const PostHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
`;

const Username = styled.div`
    font-size: 19px;
`;

const CommentContainer = styled.ul`
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    width: 611px;
    max-height: 220px;
    background: #1E1E1E;
    padding: 25px 25px 0px 25px;
    overflow-y: scroll;

    @media (max-width: 840px) {
            width: 100%;
        }

    &::-webkit-scrollbar {
        width: 15px;
        padding: 5px;
    }
    &::-webkit-scrollbar-track {
        background: none;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #ffffff;
        border-radius: 10px;
        border: 1px solid #ffffff;
    }

    li {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        border-bottom: 1px solid #353535;
        padding: 0 0 16px 0;

        div {
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            gap: 5px;

            h1 {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                font-size: 14px;
                line-height: 17px;
                color: #F3F3F3;
            }

            span {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                line-height: 17px;
                color: #ACACAC;
            }
        }

        img {
            height: 40px;
            width: 40px;
            border-radius: 26.5px;
        }
    }
`;

const PostCommentContainer = styled.div`
    display: ${props => props.isOpen ? 'flex' : 'none'};
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 10px 25px 25px 25px;
    background: #1E1E1E;
    border-radius: 16px;

    @media (max-width: 840px) {
        border-radius: 0;
        width: 100%;
    }

    img {
        height: 40px;
        width: 40px;
        border-radius: 26.5px;
        margin-right: 14px;
    }

    svg {
        position: absolute;
        color: #ffffff;
        right: 37.5px;
        width: 20px;
        height: 20px;
        cursor: pointer;
    }

    input {
        border: none;
        padding: 11px 15px;
        width: 510px;
        height: 40px;
        background: #252525;
        border-radius: 8px;
        font-family: 'Lato';
        font-style: italic;
        font-weight: 400;
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 0.05em;
        color: #ffffff;

        ::placeholder {
            color: #575757;
        }
    }
`

const LeftPart = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
`;

const CommentIcon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;

    svg {
        font-size: 28px;
        cursor: pointer;
    }
`;

const CommentText = styled.span`
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    text-align: center;
    color: #FFFFFF;
    width: 60px;
    cursor: default;
`;

const HeaderIcons = styled.div`
    display: flex;

    @media (max-width: 840px) {
        width: 100%;
        justify-content: flex-end;
    }
`;

const EditIcon = styled.div`
    width: 24px;
    cursor: pointer;
`;

const DeleteIcon = styled.div`
    width: 24px;
    cursor: pointer;
`;

const Description = styled.div`
    font-size: 17px;
    color: #B7B7B7;
    padding-top: 10px;
`;

const LinkContainer = styled.div`
    height: 155px;
    border: 1px solid #4D4D4D;
    border-radius: 11px;
    margin-top: 10px;
    display: flex;
`;

const LinkMetaData = styled.div`
    width: 70%;
    padding: 24px;

    @media ${device.mobileL} {
        width: 60%;
        padding: 20px;
    }
`;

const LinkImage = styled.img`
    background-color: white;
    width: 30%;
    border-radius: 0px 12px 13px 0px;

    @media ${device.mobileL} {
        width: 40%;
    }
`;

const LinkTitle = styled.h4`
    font-size: 16px;
    color: #CECECE;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 345px;

    @media (max-width: 840px) {
        width: 100%;
    }
`;

const LinkDescription = styled.p`
    font-size: 11px;
    color: #9B9595;
    margin-top: 10px;
    max-height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 345px;

    @media (max-width: 840px) {
        width: 100%;
    }
`;

const LinkUrl = styled.p`
    font-size: 11px;
    color: #CECECE;
    margin-top: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 345px;

    @media (max-width: 840px) {
        width: 100%;
    }
`;

const LikeIcon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 12px;
    top: 30%;
    left: 17px;
    width: auto;
    height: auto;
    gap: 5px;
    pointer-events: ${props => props.event};

    svg {
        cursor: pointer;
    }

`;

const LikeText = styled.span`
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    text-align: center;
    color: #FFFFFF;
    width: 35px;
    cursor: default;
`;

const ShareIcon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 65%;
    left: 17px;
    width: auto;
    height: auto;
    gap: 5px;
    pointer-events: ${props => props.event};
`;

const ShareText = styled.span`
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    text-align: center;
    color: #FFFFFF;
    width: 50px;
`;

const ModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const ModalText = styled.span`
    font-family: 'Lato', sans-serif;
    font-weight: 700;
    font-size: 34px;
    line-height: 41px;
    text-align: center;
    color: #FFFFFF;
    margin-bottom: 35px;
    margin-top: 10px;
`;

const ModalButtons = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
`;

const ModalButtonCancel = styled.button`
    width: 134px;
    height: 37px;
    left: 733px;
    top: 509px;
    background: #FFFFFF;
    border-radius: 5px;
    border: none;
`;

const ModalButtonConrfirm = styled.button`
    width: 134px;
    height: 37px;
    background: #1877F2;
    border-radius: 5px;
    border: none;
`;

const TooltipContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: auto;
    width: 100px;
`;

const TooltipLike = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
`;

const TooltipImg = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
`;

const TooltipName = styled.span`
    font-family: 'Lato', sans-serif;
    font-size: 11px;
    line-height: 13px;
    text-align: center;
    color: #FFFFFF;
`

const RepostContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #1E1E1E;
    border-radius: 16px;
    height: 49px;
    width: 611px;
    padding: 0 25px;

    @media (max-width: 840px) {
        border-radius: 0;
        width: 100%;
    }
`

const RepostText = styled.span`
    font-family: 'Lato', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;  
    text-align: center;
    margin-left: 10px;
    color: #FFFFFF;
`;
