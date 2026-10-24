// Calculates dynamic tooltip coordinates, arrow direction, and spotlight bounding box
// ensuring components remain within visible viewport boundaries.
import { Platform } from 'react-native';

const SCREEN_PADDING = 14;
const ARROW_SIZE = 12;
const TARGET_PADDING = 6;

/**
 * Returns estimated viewport coordinates for known tour targets
 * so spotlight cutout is ALWAYS immediately visible without waiting for async measurement.
 */
export function getDefaultTargetRect(stepId, screenWidth, screenHeight) {
  const isAndroid = Platform.OS === 'android';
  const topBarY = isAndroid ? 34 : 44;

  switch (stepId) {
    case 'home-logo':
      return {
        x: 14,
        y: topBarY,
        width: Math.min(220, screenWidth - 140),
        height: 50,
      };
    case 'header-language':
      return {
        x: screenWidth - 130,
        y: topBarY + 6,
        width: 68,
        height: 36,
      };
    case 'header-profile':
      return {
        x: screenWidth - 52,
        y: topBarY + 5,
        width: 40,
        height: 40,
      };
    case 'home-admission-cta':
      return {
        x: 16,
        y: Math.round(screenHeight * 0.40),
        width: screenWidth - 32,
        height: 56,
      };
    case 'home-campus-tour':
      return {
        x: 16,
        y: Math.round(screenHeight * 0.49),
        width: screenWidth - 32,
        height: 56,
      };
    case 'nav-admissions':
      return {
        x: Math.round((screenWidth / 5) * 1 + 6),
        y: screenHeight - 68,
        width: Math.round(screenWidth / 5 - 12),
        height: 48,
      };
    case 'nav-faculty':
      return {
        x: Math.round((screenWidth / 5) * 2 + 6),
        y: screenHeight - 68,
        width: Math.round(screenWidth / 5 - 12),
        height: 48,
      };
    case 'nav-gallery':
      return {
        x: Math.round((screenWidth / 5) * 3 + 6),
        y: screenHeight - 68,
        width: Math.round(screenWidth / 5 - 12),
        height: 48,
      };
    // Admin Steps
    case 'admin-header':
      return {
        x: 16,
        y: topBarY,
        width: screenWidth - 32,
        height: 60,
      };
    case 'admin-stat-students':
      return {
        x: 16,
        y: 110,
        width: Math.round(screenWidth * 0.45),
        height: 90,
      };
    case 'admin-stat-collected':
      return {
        x: Math.round(screenWidth * 0.52),
        y: 110,
        width: Math.round(screenWidth * 0.45),
        height: 90,
      };
    case 'admin-stat-pending':
      return {
        x: 16,
        y: 215,
        width: Math.round(screenWidth * 0.45),
        height: 90,
      };
    case 'admin-stat-today':
      return {
        x: Math.round(screenWidth * 0.52),
        y: 215,
        width: Math.round(screenWidth * 0.45),
        height: 90,
      };
    case 'admin-fee-chart':
      return {
        x: 16,
        y: 320,
        width: screenWidth - 32,
        height: 220,
      };
    case 'admin-donut-chart':
      return {
        x: 16,
        y: 560,
        width: screenWidth - 32,
        height: 200,
      };
    case 'admin-recent-payments':
      return {
        x: 16,
        y: 780,
        width: screenWidth - 32,
        height: 200,
      };
    case 'admin-menu-toggle':
      return {
        x: screenWidth - 60,
        y: topBarY + 10,
        width: 44,
        height: 44,
      };
    default:
      return null;
  }
}

/**
 * Calculate optimal placement for tooltip and arrow given target and viewport dimensions
 * @param {Object} targetRect - { x, y, width, height } in window coordinates
 * @param {Object} viewport - { width, height } of the screen/window
 * @param {Object} tooltipDim - { width, height } of the tooltip card
 * @param {string} preferredPos - 'auto' | 'top' | 'bottom' | 'left' | 'right'
 * @param {string} stepId - Optional step ID for immediate fallback bounding box
 */
export function calculateTourPosition(
  targetRect,
  viewport,
  tooltipDim = { width: 310, height: 180 },
  preferredPos = 'auto',
  stepId = ''
) {
  const screenWidth =
    viewport && Number.isFinite(viewport.width) && viewport.width > 0
      ? viewport.width
      : 360;
  const screenHeight =
    viewport && Number.isFinite(viewport.height) && viewport.height > 0
      ? viewport.height
      : 640;

  const validTooltipWidth = Math.min(
    Number.isFinite(tooltipDim?.width) ? tooltipDim.width : 310,
    screenWidth - SCREEN_PADDING * 2
  );
  const validTooltipHeight =
    Number.isFinite(tooltipDim?.height) ? tooltipDim.height : 180;

  // Determine effective target rectangle: use measured targetRect, or fallback to known default
  let effectiveRect = null;
  if (
    targetRect &&
    Number.isFinite(targetRect.x) &&
    Number.isFinite(targetRect.y) &&
    Number.isFinite(targetRect.width) &&
    Number.isFinite(targetRect.height) &&
    targetRect.width > 0 &&
    targetRect.height > 0
  ) {
    effectiveRect = targetRect;
  } else if (stepId) {
    effectiveRect = getDefaultTargetRect(stepId, screenWidth, screenHeight);
  }

  // Fallback to center of screen only if no effective target rectangle exists
  if (!effectiveRect) {
    return {
      tooltipX: Math.round((screenWidth - validTooltipWidth) / 2),
      tooltipY: Math.round((screenHeight - validTooltipHeight) / 2),
      arrowDirection: 'none',
      arrowOffset: 0,
      spotlightRect: null,
    };
  }

  const { x, y, width, height } = effectiveRect;
  const tooltipWidth = validTooltipWidth;
  const tooltipHeight = validTooltipHeight;

  // Target spotlight with generous padding
  const spotlightRect = {
    x: Math.max(0, Math.round(x - TARGET_PADDING)),
    y: Math.max(0, Math.round(y - TARGET_PADDING)),
    width: Math.round(width + TARGET_PADDING * 2),
    height: Math.round(height + TARGET_PADDING * 2),
    borderRadius: Math.min(20, Math.max(10, Math.round(height / 3))),
  };

  const targetCenterX = x + width / 2;
  const targetCenterY = y + height / 2;

  // Calculate available space around target
  const spaceBelow = screenHeight - (y + height + TARGET_PADDING);
  const spaceAbove = y - TARGET_PADDING;

  let placement = preferredPos;
  if (placement === 'auto') {
    // Prefer below if there's enough room
    if (spaceBelow >= tooltipHeight + ARROW_SIZE + 20) {
      placement = 'bottom';
    } else if (spaceAbove >= tooltipHeight + ARROW_SIZE + 20) {
      placement = 'top';
    } else {
      placement = spaceBelow >= spaceAbove ? 'bottom' : 'top';
    }
  }

  let tooltipX = targetCenterX - tooltipWidth / 2;
  let tooltipY = 0;
  let arrowDirection = 'top';

  if (placement === 'bottom') {
    // Tooltip is placed below target, arrow is on top edge of tooltip pointing up
    tooltipY = y + height + TARGET_PADDING + ARROW_SIZE;
    arrowDirection = 'top';
  } else if (placement === 'top') {
    // Tooltip is placed above target, arrow is on bottom edge of tooltip pointing down
    tooltipY = y - TARGET_PADDING - tooltipHeight - ARROW_SIZE;
    arrowDirection = 'bottom';
  }

  // Clamp horizontal coordinate inside screen
  const minX = SCREEN_PADDING;
  const maxX = screenWidth - tooltipWidth - SCREEN_PADDING;
  const clampedX = Math.round(Math.max(minX, Math.min(tooltipX, maxX)));

  // Clamp vertical coordinate so tooltip is never cut off
  const minY = SCREEN_PADDING + 10;
  const maxY = screenHeight - tooltipHeight - SCREEN_PADDING - 10;
  const clampedY = Math.round(Math.max(minY, Math.min(tooltipY, maxY)));

  // Calculate arrow's relative horizontal offset on the tooltip card
  const relativeArrowX = targetCenterX - clampedX;
  const arrowOffset = Math.round(
    Math.max(20, Math.min(relativeArrowX, tooltipWidth - 20))
  );

  return {
    tooltipX: clampedX,
    tooltipY: clampedY,
    arrowDirection,
    arrowOffset,
    spotlightRect,
  };
}
