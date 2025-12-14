import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePreview({ username, role }) {
  if (!username) {
    // Skeleton State (as requested by user)
    return (
      <div className="flex items-center space-x-4 border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
        <Skeleton className="h-12 w-12 rounded-full bg-slate-200" />
        <div className="space-y-2">
          <Skeleton className="h-4 sm:w-[250px] w-[150px] bg-slate-200" />
          <Skeleton className="h-4 sm:w-[200px] w-[100px] bg-slate-200" />
        </div>
      </div>
    )
  }

  // Live Preview State
  return (
    <div className="flex items-center space-x-4 border-2 border-black p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-purple-50 transition-all duration-300">
      {/* Avatar */}
      <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-xl border-2 border-transparent">
        {username.charAt(0).toUpperCase()}
      </div>
      
      {/* Info */}
      <div className="space-y-1">
        <h3 className="font-bold text-lg leading-none text-black">
          {username}
        </h3>
        <p className="text-sm font-medium text-purple-700 uppercase tracking-wider">
          {role}
        </p>
      </div>
    </div>
  )
}
