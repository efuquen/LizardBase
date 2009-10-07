package org.hsieh.lizardbase.client;

import com.google.gwt.core.client.JavaScriptObject;

class GISDatum extends JavaScriptObject {
  protected GISDatum() {}

  public final native long getGID() /*-{ return this.gid; }-*/;

  public final native String getLabel() /*-{ return this.label; }-*/;
  public final native String getComment() /*-{ return this.comment; }-*/;

  public final native double getLat() /*-{ return this.lat; }-*/;
  public final native double getLong() /*-{ return this.long; }-*/;

  public final native String getCity() /*-{ return this.city; }-*/;
  public final native String getState() /*-{ return this.state; }-*/;
  public final native int getZip() /*-{ return this.zip; }-*/;
}
