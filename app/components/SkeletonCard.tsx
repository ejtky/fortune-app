interface SkeletonCardProps {
  variant?: 'profile' | 'fortune' | 'compatibility' | 'direction';
  count?: number;
}

export default function SkeletonCard({
  variant = 'profile',
  count = 1
}: SkeletonCardProps) {
  const ProfileSkeleton = () => (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-200 space-y-4">
      <div className="skeleton h-8 w-3/4 rounded"></div>
      <div className="skeleton h-4 w-full rounded"></div>
      <div className="skeleton h-4 w-5/6 rounded"></div>
      <div className="skeleton h-4 w-4/6 rounded"></div>
      <div className="flex gap-2 mt-4">
        <div className="skeleton h-8 w-20 rounded-full"></div>
        <div className="skeleton h-8 w-20 rounded-full"></div>
        <div className="skeleton h-8 w-20 rounded-full"></div>
      </div>
    </div>
  );

  const FortuneSkeleton = () => (
    <div className="bg-white p-8 rounded-lg border-2 border-gray-200 space-y-4">
      <div className="text-center space-y-3">
        <div className="skeleton h-10 w-48 rounded mx-auto"></div>
        <div className="skeleton h-16 w-16 rounded-full mx-auto"></div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-4 w-full rounded"></div>
        <div className="skeleton h-4 w-full rounded"></div>
        <div className="skeleton h-4 w-3/4 rounded"></div>
      </div>
    </div>
  );

  const CompatibilitySkeleton = () => (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="skeleton h-12 w-32 rounded"></div>
        <div className="skeleton h-12 w-12 rounded-full"></div>
        <div className="skeleton h-12 w-32 rounded"></div>
      </div>
      <div className="skeleton h-20 w-20 rounded-full mx-auto mb-4"></div>
      <div className="space-y-2">
        <div className="skeleton h-4 w-full rounded"></div>
        <div className="skeleton h-4 w-5/6 rounded"></div>
      </div>
    </div>
  );

  const DirectionSkeleton = () => (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="skeleton h-24 rounded-lg"></div>
      ))}
    </div>
  );

  const skeletonComponents = {
    profile: ProfileSkeleton,
    fortune: FortuneSkeleton,
    compatibility: CompatibilitySkeleton,
    direction: DirectionSkeleton
  };

  const SkeletonComponent = skeletonComponents[variant];

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-fadeIn">
          <SkeletonComponent />
        </div>
      ))}
    </>
  );
}
