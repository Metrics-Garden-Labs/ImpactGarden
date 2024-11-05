import { NEXT_PUBLIC_URL } from "@/src/config/config";
import { BadgeDisplay, type BadgeDisplayProps } from "./BadgeDisplay";
import useSWR from "swr";

export { BadgeDisplayProps };

export const useUserBadges = (fid?: string) => {
  return useSWR<BadgeDisplayProps>(fid ? `badges.${fid}` : null, () =>
    fetch(`${NEXT_PUBLIC_URL}/api/getBadgeStatus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fid }),
    }).then((res) => res.json())
  );
};

export default function UserBadges({ fid }: { fid?: string }) {
  const { data } = useUserBadges(fid);

  return <BadgeDisplay {...data} />;
}
