package org.hsieh.lizardbase.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.TabPanel;
import com.google.gwt.user.client.ui.VerticalPanel;

public class LizardBase implements EntryPoint {

  private final TabPanel mainPanel = new TabPanel(); 

  private final VerticalPanel jbrowsePanel = new VerticalPanel();
  private final VerticalPanel mapPanel = new VerticalPanel();
  private final GISEntryPanel gisPanel = new GISEntryPanel();

  /*public LizardBase( Widget mainWidget ) { 
    this.mainWidget = mainWidget;
  }*/

  private void loadMainPanel() {

    this.mainPanel.addStyleName( "mainPanel" );

    this.mainPanel.add( this.jbrowsePanel, "JBrowse" );
    this.mainPanel.add( this.mapPanel, "Map" );
    this.mainPanel.add( this.gisPanel, "GIS" );
  }

  @Override
  public void onModuleLoad() {
    this.loadMainPanel();
    RootPanel.get("lizardBase").add(this.mainPanel);
  }
}
