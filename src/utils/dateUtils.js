// Date and Experience calculation utilities for Neekan Consulting LLP

export const calculateNeekanExperience = (joiningDateInput) => {
  if (!joiningDateInput) {
    return {
      formatted: '—',
      badge: '—',
      years: 0,
      days: 0,
      isLessThanYear: false
    };
  }

  const joinDate = new Date(joiningDateInput);
  if (isNaN(joinDate.getTime())) {
    return {
      formatted: '—',
      badge: '—',
      years: 0,
      days: 0,
      isLessThanYear: false
    };
  }

  const now = new Date();
  const diffMs = now.getTime() - joinDate.getTime();

  if (diffMs < 0) {
    return {
      formatted: 'Joining Soon',
      badge: 'New Hire',
      years: 0,
      days: 0,
      isLessThanYear: true
    };
  }

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  let years = now.getFullYear() - joinDate.getFullYear();
  let months = now.getMonth() - joinDate.getMonth();
  let days = now.getDate() - joinDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const decimalYears = Math.round((totalDays / 365.25) * 10) / 10;

  if (years >= 1) {
    // 1 year or more
    const formatted = months > 0 
      ? `${years} Yr${years > 1 ? 's' : ''} ${months} Mo${months > 1 ? 's' : ''}`
      : `${years} Year${years > 1 ? 's' : ''}`;
    
    return {
      formatted,
      badge: `${decimalYears} Yrs`,
      years: decimalYears,
      totalDays,
      isLessThanYear: false
    };
  } else {
    // Less than 1 year -> Calculate in Days
    const formatted = months > 0
      ? `${totalDays} Days (${months} Mo${months > 1 ? 's' : ''} ${days}d)`
      : `${totalDays} Day${totalDays !== 1 ? 's' : ''}`;

    return {
      formatted,
      badge: `${totalDays} Days`,
      years: decimalYears,
      totalDays,
      isLessThanYear: true
    };
  }
};
