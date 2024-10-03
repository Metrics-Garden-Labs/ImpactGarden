import { getUserAddressesByFid } from '../../lib/db/dbusers';

export interface BadgeStatus {
  isCoinbaseVerified: boolean;
  isOpBadgeholder: boolean;
  isPowerBadgeholder: boolean;
  isDelegate: boolean;
  s4Participant: boolean;
}

export async function getUserBadgeStatus(fid: string): Promise<BadgeStatus> {
  const userAddresses = await getUserAddressesByFid(fid);

  const isCoinbaseVerified = userAddresses.some(address => address.coinbaseverified);
  const isOpBadgeholder = userAddresses.some(address => address.opbadgeholder);
  const isPowerBadgeholder = userAddresses.some(address => address.powerbadgeholder);
  const isDelegate = userAddresses.some(address => address.delegate);
  const s4Participant = userAddresses.some(address => address.s4participant);

  return {
    isCoinbaseVerified,
    isOpBadgeholder,
    isPowerBadgeholder,
    isDelegate,
    s4Participant,
  };
}
