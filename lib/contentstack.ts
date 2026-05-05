import Contentstack from "contentstack";

const apiKey = process.env.CONTENTSTACK_API_KEY;
const deliveryToken = process.env.CONTENTSTACK_DELIVERY_TOKEN;
const environment = process.env.CONTENTSTACK_ENVIRONMENT || "development";
const regionStr = process.env.CONTENTSTACK_REGION || "US";

function createQueryStub(): any {
  return {
    includeReference: () => createQueryStub(),
    where: () => createQueryStub(),
    toJSON: () => createQueryStub(),
    find: async () => [[], []],
  };
}

// Map region string to SDK Region enum
const getRegion = (r: string) => {
  switch (r.toUpperCase()) {
    case "EU": return Contentstack.Region.EU;
    case "AZURE_NA": return Contentstack.Region.AZURE_NA;
    case "AZURE_EU": return Contentstack.Region.AZURE_EU;
    default: return Contentstack.Region.US;
  }
};

const FORCE_MOCK_DATA = false; // Using real API keys

const realStack = (!FORCE_MOCK_DATA && apiKey && deliveryToken)
  ? Contentstack.Stack({ 
      api_key: apiKey, 
      delivery_token: deliveryToken, 
      environment,
      region: getRegion(regionStr)
    })
  : null;

// Mock data generator for Aurora theme
function getMockData(type: string, uid?: string) {
  const authors = [
    { uid: "mock_author_1", name: "Elena Rostova", bio: "Senior UX Researcher specializing in Aurora glassmorphism.", profile_image: { url: "https://i.pravatar.cc/300?img=1" } },
    { uid: "mock_author_2", name: "Marcus Chen", bio: "Lead Frontend Architect at NexBlog.", profile_image: { url: "https://i.pravatar.cc/300?img=11" } },
    { uid: "mock_author_3", name: "Sarah Jenkins", bio: "Data Scientist turning AI into art.", profile_image: { url: "https://i.pravatar.cc/300?img=5" } }
  ];

  const blogs = [
    { uid: "mock_blog_1", title: "The Future of Aurora UIs in Web3", url: "/future-of-aurora", published_date: new Date().toISOString(), content: "<p>Glassmorphism and Aurora glows are taking over the SaaS space.</p>", featured_image: { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" }, author: [authors[0]] },
    { uid: "mock_blog_2", title: "Building Resilient Frontend Architectures", url: "/resilient-frontend", published_date: new Date().toISOString(), content: "<p>How to architect scalable Next.js apps.</p>", featured_image: { url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop" }, author: [authors[1]] },
    { uid: "mock_blog_3", title: "Data Visualization in 2026", url: "/data-viz-2026", published_date: new Date().toISOString(), content: "<p>Stunning charts with vivid colors.</p>", featured_image: { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop" }, author: [authors[2]] },
    { uid: "mock_blog_4", title: "Mastering Tailwind CSS Gradients", url: "/tailwind-gradients", published_date: new Date().toISOString(), content: "<p>A deep dive into complex background images.</p>", featured_image: { url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop" }, author: [authors[0]] }
  ];

  let data: any[] = type === "author" ? authors : blogs;
  if (uid) data = data.filter((item: any) => item.uid === uid || item.url?.includes(uid));

  return [data, []];
}

// Intercepting the ContentType to catch errors and inject mocks
const Stack = {
  ContentType: (type: string) => {
    let internalQuery: any;
    let mockUidFilter: string | undefined;

    if (realStack) {
      internalQuery = realStack.ContentType(type).Query();
    }

    const wrapQuery = (q: any): any => {
      return {
        includeReference: (refs: any) => {
          if (q) q.includeReference(refs);
          return wrapQuery(q);
        },
        where: (field: string, value: string) => {
          if (q) q.where(field, value);
          if (field === "uid" || field === "url") mockUidFilter = value.replace(/^\//, '');
          return wrapQuery(q);
        },
        toJSON: () => {
          if (q) q.toJSON();
          return wrapQuery(q);
        },
        find: async () => {
          if (q) {
            try {
              const res = await q.find();
              // If Contentstack actually connects but returns empty array for some reason, maybe fallback?
              // But a 412 throws an error, which we catch.
              return res;
            } catch (e) {
              console.warn("⚠️ Contentstack Connection Failed. Falling back to Mock Data.");
              return getMockData(type, mockUidFilter);
            }
          } else {
            return getMockData(type, mockUidFilter);
          }
        }
      }
    };

    return { Query: () => wrapQuery(internalQuery) };
  }
};

export { Stack };

