export const ModernBusinessPreview = (props) => {
  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow border">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="font-bold text-xl text-center">{props.mainHeading}</h2>
        <p className="text-xs text-blue-100 text-center">{props.date}</p>
        {/* <img className="absolute inset-0 z-10" src={props.headerImage} /> */}
      </div>

      <div className="p-4">
        <p className="font-medium mb-2">{props.greeting}</p>
        <p className="text-sm text-gray-600 mb-4">{props.introText}</p>

        <div className="border-t border-b py-4 my-4">
          <h3 className="font-bold text-lg mb-2">{props.mainArticleTitle}</h3>
          <p className="text-sm text-gray-700">
            {props.mainArticleContent.substring(0, 100)}...
          </p>
          <div className="mt-3">
            <button
              // href={props.mainArticleLink}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded inline-block"
            >
              Read More
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 text-center">
        <p className="text-xs text-gray-500">{props.footerText}</p>
        <p className="text-xs text-gray-400 mt-2">
          <button className="text-blue-600 underline">Unsubscribe</button>
        </p>
      </div>
    </div>
  );
};

export const MinimalistPreview = (props) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow border border-gray-100">
      <div className="p-4 border-b">
        <h2 className="font-light text-xl text-center">{props.mainHeading}</h2>
        <p className="text-xs text-gray-400 text-center mt-1">{props.date}</p>
      </div>

      <div className="p-6">
        <p className="font-light mb-2">{props.greeting}</p>
        <p className="text-sm text-gray-600 mb-4">{props.introText}</p>

        <div className="py-4 my-4">
          <h3 className="font-light text-lg mb-2">{props.mainArticleTitle}</h3>
          <p className="text-sm text-gray-700">
            {props.mainArticleContent.substring(0, 100)}...
          </p>
          <div className="mt-3">
            <button
              // href={props.mainArticleLink}
              className="border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded inline-block"
            >
              Read More
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 text-center">
        <p className="text-xs text-gray-500">{props.footerText}</p>
        <p className="text-xs text-gray-400 mt-2">
          <button className="text-gray-500 underline">Unsubscribe</button>
        </p>
      </div>
    </div>
  );
};

export const VibrantPreview = (props) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow border">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4">
        <h2 className="font-bold text-xl text-center">{props.mainHeading}</h2>
        <p className="text-xs text-white text-center opacity-75">
          {props.date}
        </p>
      </div>

      <div className="p-4">
        <p className="font-medium mb-2">{props.greeting}</p>
        <p className="text-sm text-gray-600 mb-4">{props.introText}</p>

        {/* Main Article */}
        <div className="bg-gradient-to-r from-yellow-50 to-red-50 p-4 rounded-lg my-4">
          <h3 className="font-bold text-lg mb-2 text-purple-600">
            {props.mainArticleTitle}
          </h3>
          <p className="text-sm text-gray-700">
            {props.mainArticleContent.substring(0, 100)}...
          </p>
          <div className="mt-3">
            <button
              // href={props.mainArticleLink}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm px-4 py-2 rounded inline-block"
            >
              Read More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-4 text-center">
        <p className="text-xs text-gray-500">{props.footerText}</p>
        <p className="text-xs text-gray-400 mt-2">
          <button className="text-purple-600 underline">Unsubscribe</button>
        </p>
      </div>
    </div>
  );
};

export const CorporatePreview = (props) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow border">
      <div className="bg-gray-800 text-white p-4">
        <h2 className="font-bold text-xl text-center">{props.mainHeading}</h2>
        <p className="text-xs text-gray-300 text-center">{props.date}</p>
      </div>

      <div className="p-4">
        <p className="font-medium mb-2">{props.greeting}</p>
        <p className="text-sm text-gray-600 mb-4">{props.introText}</p>

        <div className="border-t border-b py-4 my-4">
          <h3 className="font-bold text-lg mb-2">{props.mainArticleTitle}</h3>
          <p className="text-sm text-gray-700">
            {props.mainArticleContent.substring(0, 100)}...
          </p>
          <div className="mt-3">
            <button
              // href={props.mainArticleLink}
              className="bg-gray-800 text-white text-sm px-4 py-2 rounded inline-block"
            >
              Read More
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 text-center">
        <p className="text-xs text-gray-500">{props.footerText}</p>
        <p className="text-xs text-gray-400 mt-2">
          <button className="text-gray-600 underline">Unsubscribe</button>
        </p>
      </div>
    </div>
  );
};
