import { Stack } from "../lib/contentstack";
import Link from "next/link";
import Navbar from "@/components/Navbar";

async function getBlogs() {
  const Query = Stack.ContentType("blog").Query();
  const data = await Query.includeReference(["author"]).toJSON().find();
  return data?.[0] || [];
}

export default async function Home() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20 relative">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-[500px] bg-gradient-to-r from-accent/20 to-accent-secondary/20 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Smooth Hero Entrance */}
        <div className="relative text-center mb-24 animate-fade-in-up">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-sm font-medium text-accent tracking-wide uppercase">
            ✨ Premium Access
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-white leading-tight">
            Elevate Your Knowledge <br className="hidden md:block"/> With <span className="text-gradient">NexBlog</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Deep dives, tutorials, and perspectives from industry experts to help you stay ahead of the curve.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up delay-200">
          {blogs.map((blog: any, index: number) => {
            const authorName = Array.isArray(blog.author) ? blog.author[0]?.name : blog.author?.name;
            const authorUid = Array.isArray(blog.author) ? blog.author[0]?.uid : blog.author?.uid;

            // Bento Grid logic: Different spans based on index
            const isFeatured = index === 0;
            const spanClass = isFeatured 
              ? "md:col-span-2 md:row-span-2" 
              : index === 1 
                ? "md:col-span-2 md:row-span-1" 
                : "md:col-span-1 md:row-span-1";

            return (
              <div key={blog.uid} className={`group ${spanClass}`}>
                <div className="bento-card h-full flex flex-col">
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-accent-secondary/20 blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  
                  <Link href={blog.url ? `/blog/${blog.url.replace(/^\/?(blog\/)?/, '')}` : '#'} className="relative h-full flex flex-col z-10">
                    <div className={`${isFeatured ? 'h-80' : 'h-48'} overflow-hidden relative`}>
                      <img
                        src={blog.featured_image?.url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80"}
                        alt={blog.title ?? "Blog thumbnail"}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-[#050914]/40 to-transparent opacity-80"></div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        {blog.published_date && (
                          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                            {new Date(blog.published_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                        <span className="w-1 h-1 rounded-full bg-accent/50"></span>
                        <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Insight</span>
                      </div>

                      <h2 className={`${isFeatured ? 'text-3xl' : 'text-lg'} font-bold mb-4 text-white group-hover:text-accent transition-colors leading-tight`}>
                        {blog.title}
                      </h2>

                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        {authorUid ? (
                          <div className="text-xs font-medium text-gray-400 flex items-center gap-2">
                            <span className="text-white/60">By</span>
                            <span className="text-white hover:text-accent transition-colors">{authorName}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider">NexBlog Editorial</span>
                        )}
                        
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all duration-300">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7"></line>
                            <polyline points="7 7 17 7 17 17"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
