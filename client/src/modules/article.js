const ARTICLE = "@@ARTICLE";
const ARTICLE_CREATE_SUCCESS = `${ARTICLE}/CREATE_SUCCESS`;
const ARTICLE_LOADING = `${ARTICLE}/LOADING`;
const ARTICLE_ERROR = `${ARTICLE}/ERROR`;

const initialState = {
  article: null,
  loading: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ARTICLE_CREATE_SUCCESS:
      return {
        ...state,
        article: action.payload
      };
    case ARTICLE_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case ARTICLE_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

const createArticleSuccess = article => ({
  type: ARTICLE_CREATE_SUCCESS,
  payload: article
});

const articleLoading = loading => ({
  type: ARTICLE_LOADING,
  payload: loading
});

const articleError = error => ({
  type: ARTICLE_ERROR,
  payload: error
});

const clearArticleError = error => ({
  type: ARTICLE_ERROR,
  payload: null
});

export const createArticle = url => {
  return async dispatch => {
    if (!url) {
      dispatch(articleError("url cannot be blank"));
      return;
    }
    dispatch(createArticleSuccess(null));
    dispatch(clearArticleError());
    dispatch(articleLoading(true));

    try {
      const res = await fetch("/api/articles", {
        body: JSON.stringify({ url }),
        method: "POST",
        headers: {
          "content-type": "application/json"
        }
      });

      const json = await res.json();
      dispatch(articleLoading(false));

      if (res.status !== 200) {
        if (typeof json.error === "object") {
          dispatch(articleError(""));
        } else {
          dispatch(articleError(json.error));
        }
      } else {
        dispatch(createArticleSuccess(json));
      }

      return json;
    } catch (error) {
      dispatch(articleLoading(false));
      dispatch(articleError(error));
      return error;
    }
  };
};
