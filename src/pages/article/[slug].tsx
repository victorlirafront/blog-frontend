import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import {
  StyledPostNew,
  Container,
  ParallaxContainer,
  ParallaxImage,
  Overlay,
  OverlayTitle,
  Profile,
  BodyPost,
  PostDate,
  AsideAbsolute,
  ShareContent,
  ShareButtonWrapper,
  Writer,
  Author,
  NameContainer,
  Text1,
  Text2,
  Title,
  LastPosts,
  SliderContent,
  BreadcrumbContainer,
  BreadcrumbItem,
} from '@/components/Article/Posts.styled';
import Link from 'next/link';
import dateFormatter from '@/helper/functions/dateFormatter';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  RedditIcon,
  TelegramIcon,
  LinkedinIcon,
} from 'next-share';
import { FAVICON } from '@/constants/images';
import { useAppSelector } from '@/store/hooks';
import { updateFavoritSource } from '@/helper/functions/updateFavoritSource';
import { Post } from '../../presenters/Post';
import PostComponent from '@/components/Post';
import { GetStaticPropsContext } from 'next';
import { PostService } from '../../services/PostService';
import LoginAlertModal from '@/components/LoginAlertModal';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ReadingProgressBar from '@/components/ReadingProgressBar';

type IProps = {
  post: Post;
  relatedPosts: Post[];
};

function Posts(props: IProps) {
  const [settings] = useState({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    arrows: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1186,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
        },
      },
    ],
  });

  useEffect(() => {
    AOS.init();
  }, []);

  const favoritPosts = useAppSelector(state => state.favorites.favoritPosts);
  const currentUser = useAppSelector(state => state.user.currentUser);
  const [displayLoginModal, setDisplayLoginModal] = useState(false);

  const displayLoginAlert = function () {
    setDisplayLoginModal(true);
  };

  const closeLoginAlertModal = function () {
    setDisplayLoginModal(false);
  };

  return (
    <StyledPostNew>
      <ReadingProgressBar />
      <Head>
        <title>{props.post.metaTagTitle}</title>
        <meta name="title" content={props.post.metaTagTitle} />
        <meta name="description" content={props.post.metaTagDescription}></meta>
        <meta name="author" content={props.post.author} />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={props.post.keywords} />
        <meta property="og:image" content={props.post.postImage} />
        <link rel="icon" href={FAVICON} />
      </Head>
      {!currentUser.email && displayLoginModal && (
        <LoginAlertModal onCloseLoginAlertModal={closeLoginAlertModal} />
      )}

      <Container>
        <ParallaxContainer>
          <ParallaxImage />
        </ParallaxContainer>

        <Overlay>
          <OverlayTitle>{props.post.title}</OverlayTitle>
        </Overlay>
      </Container>

      <Profile>
        <BodyPost>
          <PostDate>{dateFormatter(props.post.date)}</PostDate>
          <BreadcrumbContainer>
            <BreadcrumbItem>
              <Link href="/">Articles</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <span className="separator">›</span>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link href={`/?category=${props.post.category}`}>{props.post.category}</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <span className="separator">›</span>
            </BreadcrumbItem>
            <BreadcrumbItem className="current">{props.post.title}</BreadcrumbItem>
          </BreadcrumbContainer>

          <MarkdownRenderer> {props.post.content} </MarkdownRenderer>
          <AsideAbsolute>
            <ShareContent>
              <TwitterShareButton
                url={`https://www.victorlirablog.com/article/${props.post.slug}`}
                title={props.post.metaTagTitle}
              >
                <ShareButtonWrapper>
                  <TwitterIcon size={30} round />
                </ShareButtonWrapper>
              </TwitterShareButton>
              <RedditShareButton
                url={`https://www.victorlirablog.com/article/${props.post.slug}`}
                title={props.post.metaTagTitle}
              >
                <ShareButtonWrapper>
                  <RedditIcon size={30} round />
                </ShareButtonWrapper>
              </RedditShareButton>
              <TelegramShareButton
                url={`https://www.victorlirablog.com/article/${props.post.slug}`}
                title={props.post.metaTagTitle}
              >
                <ShareButtonWrapper>
                  <TelegramIcon size={30} round />
                </ShareButtonWrapper>
              </TelegramShareButton>
              <FacebookShareButton
                url={`https://www.victorlirablog.com/article/${props.post.slug}`}
                quote={props.post.metaTagTitle}
              >
                <ShareButtonWrapper>
                  <FacebookIcon size={30} round />
                </ShareButtonWrapper>
              </FacebookShareButton>
              <LinkedinShareButton
                url={`https://www.victorlirablog.com/article/${props.post.slug}`}
                title={props.post.metaTagTitle}
                summary={props.post.metaTagDescription}
              >
                <ShareButtonWrapper>
                  <LinkedinIcon size={30} round />
                </ShareButtonWrapper>
              </LinkedinShareButton>
            </ShareContent>
          </AsideAbsolute>
        </BodyPost>
        <Writer>
          <Author />
          <NameContainer>
            <Text1>Victor Lira &nbsp; 🚀</Text1>
            <Text2>Written by Victor Lira</Text2>
          </NameContainer>
        </Writer>
      </Profile>
      <Title>Latest posts</Title>
      <LastPosts>
        <Slider {...settings}>
          {props.relatedPosts &&
            props.relatedPosts.map((post: Post) => {
              return (
                <SliderContent key={post.id}>
                  <PostComponent
                    onDisplayLoginAlert={displayLoginAlert}
                    id={post.id}
                    category={post.category}
                    content={post.content}
                    date={post.date}
                    metaTagDescription={post.metaTagDescription}
                    metaTagTitle={post.metaTagTitle}
                    title={post.title}
                    postImage={post.postImage}
                    postBackground={post.postBackground}
                    author={post.author ?? 'Unknown Author'}
                    keywords={post.keywords}
                    slug={post.slug}
                    aos_delay=""
                    aos_type=""
                    hover_animation={-7}
                    onUpdateFavoritSource={updateFavoritSource(favoritPosts, post)}
                  />
                </SliderContent>
              );
            })}
        </Slider>
      </LastPosts>
    </StyledPostNew>
  );
}

export async function getStaticPaths() {
  try {
    const postService = new PostService();
    const data = await postService.getAllPosts('1', '50', 'all');
    const paths = data.results.map((post: Post) => ({
      params: { slug: post.slug },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

const POST_CACHE_REVALIDATE_TIME = 3600;

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const { slug } = params!;

  try {
    const postService = new PostService();
    const post = await postService.getPostBySlug(slug as string);
    const relatedPostsData = await postService.getAllPosts('1', '5', 'all');
    const relatedPosts = relatedPostsData.results.filter(p => p.id !== post.id);

    return {
      props: {
        post,
        relatedPosts,
      },
      revalidate: POST_CACHE_REVALIDATE_TIME,
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      notFound: true,
    };
  }
}

export default Posts;
