export function releaseNavigationFocus() {
  if(typeof document!=='undefined' && document.activeElement instanceof HTMLElement) document.activeElement.blur();
}
export function focusScreenHeading() {
  if(typeof document==='undefined')return;
  const heading=Array.from(document.querySelectorAll<HTMLElement>('[role="heading"]')).find(element=>
    !element.closest('[aria-hidden="true"], [inert]') && element.getClientRects().length>0);
  if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
}
