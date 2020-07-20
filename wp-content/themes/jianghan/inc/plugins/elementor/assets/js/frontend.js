( function( $ ) {
	var WidgetHeaderBarHandler = function( $scope, $ ) {
		
		$('.site-header--elementor .header-search-link').on('click', function (e) {
			e.preventDefault();
			$('body').toggleClass('search-visible-el');
			if ( ! navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
				setTimeout(function () {
					$('body').find('.header-search-wrap--elementor .search-field-top').focus();
				}, 90);
			}
		});

		// Hide Search
		$('.site-header--elementor .close-search').on('click', function (e) {
			e.preventDefault();
			$('body').removeClass('search-visible-el');
			$('.header-search-wrap--elementor input.search-field-top').val('');
		});

		$(document).click(function (e) {
			var container = $('.header-search-wrap--elementor, .site-header--elementor .header-search-link');
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				$('body').removeClass('search-visible-el');
			}
		});

		$(document).keyup(function (e) {
			if (e.keyCode === 27) {
				$('body').removeClass('search-visible-el');
			}
		});

		//Replace icons
		function iconReplace( iSelector, iClass, data ) {
			var iVar = $( iSelector );
			var dataSearchValue = $( '.site-header--elementor' ).data( data );
			if ( $( '.site-header--elementor' ).data( data ) !== '' ) {
				iVar.removeClass( iClass );
				iVar.addClass( dataSearchValue );
			} else {
				iVar.addClass( iClass );
			}
		}

		iconReplace( '.site-header--elementor .header-search-link i', 'bb-icon-search', 'search-icon' );
		iconReplace( '.site-header--elementor #header-messages-dropdown-elem .notification-link i', 'bb-icon-inbox-small', 'messages-icon' );
		iconReplace( '.site-header--elementor #header-notifications-dropdown-elem .notification-link i', 'bb-icon-bell-small', 'notifications-icon' );
		iconReplace( '.site-header--elementor a.header-cart-link i', 'bb-icon-shopping-cart', 'cart-icon' );
		iconReplace( 'body:not(.bb-dark-theme) .site-header--elementor a#bb-toggle-theme i', 'bb-icon-moon-circle', 'dark-icon' );
		iconReplace( '.bb-dark-theme .site-header--elementor a#bb-toggle-theme i', 'bb-icon-sun', 'dark-icon' );
		iconReplace( '.site-header--elementor a.header-maximize-link i', 'bb-icon-maximize', 'sidebartoggle-icon' );
		iconReplace( '.site-header--elementor a.header-minimize-link i', 'bb-icon-minimize', 'sidebartoggle-icon' );


		// NB - Duplicated as per theme main.js sidePanel()
		// whenever we hover over a menu item that has a submenu
		$('.user-wrap li.parent, .user-wrap .menu-item-has-children').on('mouseover', function() {
			var $menuItem = $(this),
				$submenuWrapper = $('> .wrapper', $menuItem);

			// grab the menu item's position relative to its positioned parent
			var menuItemPos = $menuItem.position();

			// place the submenu in the correct position relevant to the menu item
			$submenuWrapper.css({
				top: menuItemPos.top
			});
		});

		// Fix user mention position
		$(document).ready(function() {
			if ( $( '.site-header--elementor .bp-suggestions-mention' ).length ) {
				var userMentionText = $( '.site-header--elementor .bp-suggestions-mention' ).text();
				$( '.site-header--elementor .sub-menu .user-mention' ).append( document.createTextNode( userMentionText ) );
				$( '.site-header--elementor .bp-suggestions-mention' ).hide();
			}
		});

	};
	
	// Make sure you run this code under Elementor..
	$( window ).on( 'elementor/frontend/init', function() {
		elementorFrontend.hooks.addAction( 'frontend/element_ready/header-bar.default', WidgetHeaderBarHandler );
	} );
} )( jQuery );
