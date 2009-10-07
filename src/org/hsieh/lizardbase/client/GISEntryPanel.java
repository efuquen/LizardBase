package org.hsieh.lizardbase.client;

import com.google.gwt.user.client.ui.VerticalPanel;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Label;

class GISEntryPanel extends VerticalPanel {

  private final Label nameLabel = new Label( "GIS Label" );
  private final TextBox nameTextBox = new TextBox();

  private final HorizontalPanel namePanel = new HorizontalPanel();

  public GISEntryPanel() {
    super();

    this.namePanel.add( nameLabel );
    this.namePanel.add( nameTextBox );

    this.add( this.namePanel );
  }
  
}
