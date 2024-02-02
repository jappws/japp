import "./loading.css";
export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-[200px] flex justify-center items-center">
      <svg
        id="loader"
        width="539"
        height="77"
        viewBox="0 0 539 77"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M534.166 22.728V18.728H530.166H492.022H488.022V22.728V33.992V37.992H492.022H499.926V68.04V72.04H503.926H518.134H522.134V68.04V37.992H530.166H534.166V33.992V22.728Z"
          stroke="black"
          stroke-width="8"
        />
        <path
          d="M483.206 22.728V18.728H479.206H464.998H460.998V22.728V68.04V72.04H464.998H479.206H483.206V68.04V22.728Z"
          stroke="black"
          stroke-width="8"
        />
        <path
          d="M456.184 22.728V18.728H452.184H414.04H410.04V22.728V33.992V37.992H414.04H421.944V68.04V72.04H425.944H440.152H444.152V68.04V37.992H452.184H456.184V33.992V22.728Z"
          stroke="black"
          stroke-width="8"
        />
        <path
          d="M404.366 39.624V38.056H406.286V34.056V22.728V18.728H402.286H372.078H368.078V22.728V68.04V72.04H372.078H402.286H406.286V68.04V56.712V52.712H404.366V50.312V39.624Z"
          stroke="black"
          stroke-width="8"
        />
        <path
          d="M360.096 48.0795L360.104 48.0658L360.112 48.052C361.793 45.0691 362.611 41.7832 362.611 38.28C362.611 32.6324 360.792 27.7402 356.885 24.0512C352.963 20.3056 347.587 18.728 341.395 18.728H321.555H317.555V22.728V68.04V72.04H321.555H335.763H339.763V68.04V57.64H341.395C345.546 57.64 349.339 56.8688 352.609 55.1279C355.806 53.4486 358.357 51.1082 360.096 48.0795ZM340.211 38.28C340.211 38.3316 340.21 38.3785 340.208 38.4211C340.1 38.4321 339.963 38.44 339.795 38.44H339.763V38.12H339.795C339.963 38.12 340.1 38.1279 340.208 38.1389C340.21 38.1815 340.211 38.2284 340.211 38.28Z"
          stroke="black"
          stroke-width="8"
        />
        <path
          d="M245.639 38.4355L245.634 38.4476L245.628 38.4598C244.054 41.8703 243.34 45.7529 243.34 49.992C243.34 54.2334 244.055 58.1271 245.618 61.5672L245.634 61.6007L245.649 61.6339C247.242 64.9739 249.485 67.7042 252.432 69.6499L252.454 69.6645L252.476 69.6788C255.414 71.5633 258.709 72.488 262.252 72.488C264.353 72.488 266.367 72.1803 268.236 71.5009V72.04H272.236H286.38H290.38V68.04V31.944V27.944H286.38H280.46V20.04V17.393L278.024 16.3583L261.448 9.31829L255.884 6.95535V13V23.496V26.2996L258.519 27.256L259.663 27.6711C257.084 28.0274 254.665 28.9281 252.454 30.3836C249.474 32.3014 247.227 35.0559 245.639 38.4355ZM267.82 48.2202C267.926 48.3354 268.236 48.7422 268.236 49.992C268.236 51.2418 267.926 51.6486 267.82 51.7638C267.646 51.9534 267.48 52.072 266.988 52.072C266.495 52.072 266.33 51.9534 266.156 51.7638C266.05 51.6486 265.74 51.2419 265.74 49.992C265.74 48.7421 266.05 48.3354 266.156 48.2202C266.33 48.0306 266.495 47.912 266.988 47.912C267.48 47.912 267.646 48.0306 267.82 48.2202Z"
          stroke="black"
          stroke-width="8"
        />
        <path
          d="M220.611 22.728V18.728H216.611H178.467H174.467V22.728V33.992V37.992H178.467H186.371V68.04V72.04H190.371H204.579H208.579V68.04V37.992H216.611H220.611V33.992V22.728Z"
          stroke="black"
          stroke-width="8"
        />
        <path
          d="M169.65 22.728V18.728H165.65H151.442H147.442V22.728V68.04V72.04H151.442H165.65H169.65V68.04V22.728Z"
          stroke="black"
          stroke-width="8"
        />
        <path
          d="M142.629 22.728V18.728H138.629H100.485H96.4849V22.728V33.992V37.992H100.485H108.389V68.04V72.04H112.389H126.597H130.597V68.04V37.992H138.629H142.629V33.992V22.728Z"
          stroke="black"
          stroke-width="8"
        />
        <path
          d="M90.8105 39.624V38.056H92.7305V34.056V22.728V18.728H88.7305H58.5225H54.5225V22.728V68.04V72.04H58.5225H88.7305H92.7305V68.04V56.712V52.712H90.8105V50.312V39.624Z"
          stroke="black"
          stroke-width="8"
        />
        <path
          d="M46.541 48.0795L46.5489 48.0658L46.5566 48.052C48.2379 45.069 49.056 41.7832 49.056 38.28C49.056 32.6324 47.2369 27.7402 43.3302 24.0512C39.4076 20.3056 34.0319 18.728 27.84 18.728H8H4V22.728V68.04V72.04H8H22.208H26.208V68.04V57.64H27.84C31.9908 57.64 35.7842 56.8688 39.0542 55.1279C42.2506 53.4486 44.8023 51.1082 46.541 48.0795ZM26.656 38.28C26.656 38.3316 26.655 38.3785 26.6532 38.4211C26.5446 38.4321 26.4081 38.44 26.24 38.44H26.208V38.12H26.24C26.4081 38.12 26.5446 38.1279 26.6532 38.1389C26.655 38.1815 26.656 38.2284 26.656 38.28Z"
          stroke="black"
          stroke-width="8"
        />
      </svg>
    </div>
  );
};