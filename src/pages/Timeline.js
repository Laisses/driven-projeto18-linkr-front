import { BASE_URL, BASE_URL_LOCAL } from "../constants/url";
import styled from "styled-components";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { TiPencil, TiTrash } from "react-icons/ti";
import { BiRepost, BiRefresh } from "react-icons/bi";
import { IoPaperPlaneOutline } from "react-icons/io5"
import { AiOutlineComment } from 'react-icons/ai'
import { useContext, useEffect, useState } from "react";
import { MyContext } from "../contexts/MyContext";
import TrendingList from "../components/trending";
import Header from "../constants/header";
import axios from "axios";
import { Link } from "react-router-dom";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { ReactTagify } from "react-tagify"
import { useNavigate } from "react-router-dom";
import DeleteReactModal from "react-modal";
import ShareReactModal from "react-modal";
import { device } from "../constants/device";
import useInterval from "use-interval";

export const Timeline = () => {
    const { config, counter, setCounter, data, token, followingIds } = useContext(MyContext);
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState({ description: "", link: "" });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteModalPostId, setDeleteModalPostId] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareModalPostId, setShareModalPostId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [timestamp, setTimestamp] = useState(null);
    const [nextPosts, setNextPosts] = useState([]);
    const [clickedPosts, setClickedPosts] = useState([]);  
    const navigate = useNavigate();
    
    useEffect(() => {
        if (token === null) {
            alert("You must be logged in to access this page");
            navigate("/")
        }
    });
    
    useInterval(async () => {
        await getNewPosts();
    }, 15000);

    const deletePostHandler = async (postId) => {
        try {
            await axios.delete(`${BASE_URL}/timeline/${postId}`, config);
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
            const res = await axios.get(`${BASE_URL}/timeline`, config);
            setPosts(res.data);
            setTimestamp(new Date().toISOString());
        } catch (error) {
            setErrorMessage(true);
            //alert("You must login to access this page");
            //navigate("/");
        }
    };

    const getNewPosts = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/timeline?timestamp=${timestamp}`, config);
            setNextPosts(res.data.concat(nextPosts));
            setTimestamp(new Date().toISOString());
        } catch (error) {
            console.log(error);
        }
    }

    const postRepost = async (postId) => {
            const request = axios.post(`${BASE_URL}/reposts`, {id: postId}, config);
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
    }, [setErrorMessage]);

    const likeHandler = (postId) => {
        const request = axios.post(`${BASE_URL}/likes`, {id: postId}, config);
            request.then(() => {
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
                        <TooltipImg src={like.user_photo} />
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
        const followedPosts = posts.filter((p) => {
            if (followingIds.includes(p.user.id)) {
                return true
            }
        })

        if (!posts) {
            return <Message>Loading...</Message>
        } else if(followingIds.length === 0) {
            return <Message>You don't follow anyone yet. Search for new friends!</Message>
        } else if (followedPosts.length === 0) {
            return <Message>No posts found from your friends</Message>
        } else if (posts) {
            
            return (
                <ListContainer>
                    {followedPosts.map(p => <ListofPosts
                        key={p.id}
                        {...p}
                    />)}
                </ListContainer>
            );
        }
    };

    const handleForm = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const validateURL = url => {
        const regex = /^((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/;

        return regex.test(url);
    };

    const submitForm = async () => {
        setLoading(true);

        const validURL = validateURL(form.link);
        const descriptionWords = form.description.split(" ")

        if (!validURL) {
            setLoading(false);
            return alert("You must choose a valid link!");
        }

        try {
            const res = await axios.post(`${BASE_URL}/timeline`, form, config);

            descriptionWords.forEach((w) => {
                if (w.includes("#")) {
                    addHashtag(w.replace("#", ""), res.data.post_id)
                }
            })

            setLoading(false);
            setForm({ description: "", link: "" });
            getPosts();
        } catch (error) {
            setLoading(false);
            alert("Houve um erro ao publicar seu link");
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

    const NewPostsButton = () => {

        if (nextPosts.length === 1) {
            return (
                <RefreshButton onClick={() => {
                    setPosts(nextPosts.concat(posts));
                    setNextPosts([]);
                }}>
                    <RefreshButtonSpan>
                        1 new post, load more!
                    </RefreshButtonSpan>
                    <BiRefresh size={"22px"} />
                </RefreshButton>
            );
        } else if (nextPosts.length > 1) {
            return (
                <RefreshButton onClick={() => {
                    setPosts(nextPosts.concat(posts));
                    setNextPosts([]);
                }}>
                    <RefreshButtonSpan>
                        {nextPosts.length} news post, load more!
                    </RefreshButtonSpan>
                    <BiRefresh size={"22px"} />
                </RefreshButton>
            );
        } else {
            return <div></div>
        }
    };

    return (
        <>
            <Header />
            <DeleteReactModal
                isOpen={isDeleteModalOpen}
                contentLabel="Minimal Modal Example"
                style={{
                    overlay: {
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

                    }
                }}
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
                style={{
                    overlay: {
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

                    }
                }}
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
                    <Title>timeline</Title>
                    <PublishContainer>
                        <ProfilePictureForm
                            src={data.user.photo}
                            alt="profile picture"
                        />
                        <Form>
                            <FormTitle>What are you going to share today?</FormTitle>
                            <LinkInput
                                type="text"
                                id="link"
                                name="link"
                                placeholder="http://..."
                                value={form.link}
                                onChange={handleForm}
                                disabled={loading}
                                required
                            />
                            <TextInput
                                id="description"
                                name="description"
                                placeholder="Awesome article about #javascript"
                                value={form.description}
                                onChange={handleForm}
                                disabled={loading}
                            />
                            {!loading
                                ? <Button onClick={submitForm}>Publish</Button>
                                : <Button disabled={loading}>Publishing</Button>
                            }
                        </Form>
                    </PublishContainer>
                    <NewPostsButton />
                    {!errorMessage
                        ? <Posts />
                        : <Message>An error occured while trying to fetch the posts, please refresh the page</Message>
                    }
                </TimelineContainer>
                <TrendingList />
            </TimelineBackground>
        </>
    );
};

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

    @media ${device.mobileL} {
        padding-left: 16px;
    }
`;

const PublishContainer = styled.div`
    height: 209px;
    padding: 16px;
    background-color: #ffffff;
    border-radius: 16px;
    display: flex;
    margin-bottom: 30px;

    @media ${device.tablet} {
        border-radius: 0;
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

const Form = styled.form`
    padding-left: 18px;
    display: flex;
    flex-direction: column;
    width: 90%;

    @media ${device.mobileL} {
        width: 100%;
        padding-left: 0;
    }
`;

const ProfilePictureForm = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;

    @media ${device.mobileL} {
        display: none;
    }
`;

const FormTitle = styled.h2`
    font-family: 'Lato', sans-serif;
    font-size: 20px;
    font-weight: 300;
    color: #707070;
    padding-top: 6px;
    padding-bottom: 10px;

    @media ${device.mobileL} {
        text-align: center;
    }
`;

const LinkInput = styled.input`
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: 300;
    height: 30px;
    border-radius: 3px;
    background-color: #EFEFEF;
    border: none;
    margin-top: 5px;
    padding-left: 10px;
    &:focus {
        outline: none;
    }
`;

const TextInput = styled.textarea`
    font-family: 'Lato', sans-serif;
    font-size: 15px;
    font-weight: 300;
    height: 66px;
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

const Button = styled.button`
    width: 112px;
    height: 31px;
    border: none;
    border-radius: 5px;
    margin-top: 5px;
    color: #ffffff;
    background-color: ${props => !props.disabled ? "#1877F2" : "#1154ab"};
    align-self: flex-end;
    cursor: pointer;
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
`

const RefreshButton = styled.button`
    width: 100%;
    height: 61px;
    max-width: 611px;
    background-color: #1877F2;
    color: #ffffff;
    border: none;
    border-radius: 16px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    font-family: 'Lato', sans-serif;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const RefreshButtonSpan = styled.span`
    color: #ffffff;
    margin-right: 14px;
`;
