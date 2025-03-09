// Utility functions for parsing and validating social media links

export const socialMediaUtils = {
  // Parse social media links from string
  parseLinks(linksString: string): string[] {
    if (!linksString) return [];
    return linksString.split('\n').filter(link => link.trim() !== '');
  },

  // Get platform name from URL
  getPlatform(url: string): string {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('twitter') || urlLower.includes('x.com')) {
      return 'Twitter';
    } else if (urlLower.includes('facebook') || urlLower.includes('fb.com')) {
      return 'Facebook';
    } else if (urlLower.includes('instagram') || urlLower.includes('ig.')) {
      return 'Instagram';
    } else if (urlLower.includes('linkedin')) {
      return 'LinkedIn';
    } else if (urlLower.includes('github')) {
      return 'GitHub';
    } else if (urlLower.includes('youtube') || urlLower.includes('youtu.be')) {
      return 'YouTube';
    } else if (urlLower.includes('dribbble')) {
      return 'Dribbble';
    } else if (urlLower.includes('behance')) {
      return 'Behance';
    } else if (urlLower.includes('medium')) {
      return 'Medium';
    } else if (urlLower.includes('pinterest')) {
      return 'Pinterest';
    } else if (urlLower.includes('tiktok')) {
      return 'TikTok';
    } else if (urlLower.includes('reddit')) {
      return 'Reddit';
    } else if (urlLower.includes('tumblr')) {
      return 'Tumblr';
    } else if (urlLower.includes('flickr')) {
      return 'Flickr';
    } else if (urlLower.includes('vimeo')) {
      return 'Vimeo';
    } else if (urlLower.includes('twitch')) {
      return 'Twitch';
    } else {
      return 'Website';
    }
  },
  
  // Validate website URL
  validateWebsite(url: string): boolean {
    if (!url) return true; // Empty is valid
    
    try {
      // Check if URL is valid
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },

  // Get domain from URL
  getDomain(url: string): string {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname.replace('www.', '');
    } catch (e) {
      return url;
    }
  }
};

// Function to validate profile data
export const validateProfileData = (bio: string, website: string): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  // Bio validation
  if (bio && bio.length > 500) {
    errors.bio = 'Bio cannot exceed 500 characters';
  }
  
  // Website validation
  if (website && !socialMediaUtils.validateWebsite(website)) {
    errors.website = 'Please enter a valid URL';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};