import { Stack } from "../../../lib/contentstack";
import Navbar from "@/components/Navbar";
import Link from "next/link";

async function getAuthorData(uid: string) {
  // 1. Fetch Author
  const authorQ = await Stack.ContentType("author").Query().where("uid", uid).toJSON().find();
  const author = authorQ?.[0]?.[0];

  // 2. Fetch Author's Blogs
  const blogQ = await Stack.ContentType("blog").Query().includeReference(["author"]).toJSON().find();
  const allBlogs = blogQ?.[0] || [];
  
  const authorBlogs = allBlogs.filter((b: any) => {
    if (Array.isArray(b.author)) {
      return b.author.some((a: any) => a.uid === uid);
    }
    return b.author?.uid === uid;
  });

  return { author, authorBlogs };
}

export default async function AuthorDetailPage({
  params,
}: {
  params: Promise<{ uid: string }>;
}) {
  const { uid } = await params;
  const { author, authorBlogs } = await getAuthorData(uid);

  if (!author) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="p-20 text-center">
          <p className="text-red-400 text-xl font-medium">Author not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-16 animate-fade-in-up">
        {/* Author Header Card */}
        <div className="relative group max-w-5xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-accent-secondary/20 blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          
          <div className="relative flex flex-col md:flex-row gap-12 items-center md:items-start bg-[#050914]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-secondary/5 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="shrink-0 relative">
              <div className="absolute -inset-4 bg-accent/20 blur-2xl rounded-full opacity-0 group-hover:opacity-40 transition duration-700"></div>
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-white/5 shadow-2xl">
                <img 
                  src={author.profile_image?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random`} 
                  alt={author.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="relative z-10 text-center md:text-left flex-grow">
              <div className="inline-block mb-4 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[10px] font-bold uppercase tracking-widest text-accent">
                Verified Author
              </div>
              <h1 className="text-5xl md:text-8xl font-black mb-6 text-white tracking-tighter">
                {author.name}
              </h1>
              {author.bio && (
                <div 
                  className="text-xl text-slate-400 leading-relaxed max-w-2xl prose prose-invert prose-dark mb-8"
                  dangerouslySetInnerHTML={{ __html: author.bio }}
                />
              )}
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-accent hover:text-white transition-all duration-300">
                  Follow Author
                </button>
                <button className="px-8 py-3 rounded-full border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all duration-300">
                  View Socials
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
